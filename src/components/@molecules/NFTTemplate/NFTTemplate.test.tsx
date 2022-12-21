import { cleanup, render, waitFor } from '@app/test-utils'

import NFTTemplate from './NFTTemplate'

describe('NFTTemplate', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render', async () => {
    const { getByText } = render(
      <NFTTemplate name="nick.arb" backgroundImage={undefined} isNormalised />,
    )
    expect(getByText('nick.arb')).toBeInTheDocument()
  })

  it('should render with background', async () => {
    const whiteBG =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg=='
    const { getByText, getByTestId } = render(
      <NFTTemplate name="validator.arb" backgroundImage={whiteBG} isNormalised />,
    )
    expect(getByText('validator.arb')).toBeInTheDocument()
    expect(getByTestId('nft-back-img')).toBeInTheDocument()
  })

  it('should render with subdomain', async () => {
    const { getByText } = render(
      <NFTTemplate name="itsasubdomain.khori.arb" backgroundImage={undefined} isNormalised />,
    )
    expect(getByText('itsasubdomain.')).toBeInTheDocument()
  })

  it('should render domain with more than 25 chars', async () => {
    const { getByText } = render(
      <NFTTemplate
        name="thisnameislongerthan25char.arb"
        backgroundImage={undefined}
        isNormalised
      />,
    )
    expect(getByText('thisnameislonge')).toBeInTheDocument()
    expect(getByText('rthan25char.arb')).toBeInTheDocument()
  })

  it('should use polyfill of Intl.Segmenter if browser does not support', async () => {
    ;(window.Intl.Segmenter as typeof Intl['Segmenter']) = undefined as any
    const { getByText } = render(
      <NFTTemplate name="alisha.arb" backgroundImage={undefined} isNormalised />,
    )
    await waitFor(() => expect(getByText('alisha.arb')).toBeInTheDocument())
    expect(getByText('alisha.arb')).toBeInTheDocument()
  })
})
