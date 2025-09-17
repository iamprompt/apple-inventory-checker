export interface ProductLocatorMetaResponse {
  head: Head
  body: Body
}

export interface Head {
  status: string
  data: Record<string, unknown>
}

export interface Body {
  productLocatorOverlayData: ProductLocatorOverlayData
}

export interface ProductLocatorOverlayData {
  overlayHeader: string
  search: Search
  familyLevelFragments: LevelFragments
  overlayLevelFragments: LevelFragments
  hideRecommendations: boolean
  displayableDimensionVariants: DisplayValues
  familyLevelTextAssets: LevelTextAssets
  overlayLevelTextAssets: LevelTextAssets
  productLocatorMeta: ProductLocatorMeta
}

export interface Search {
  searchPlaceholder: string
  autosaveValue: string
  typeAheadUrl: string
  maxlength: number
  pattern: string
  isAutoCompleteEnabled: boolean
  invalidFormatError: string
  autoCompleteChoiceAllyTxt: string
  autoCompleteUrl: string
  requiredError: string
  typeAheadMinChars: number
  searchTxt: string
  autocompleteOn: string
  autoCompleteChoicesAllyTxt: string
  isTypeAheadEnabled: boolean
}

export interface LevelFragments {
  namedFragments: NamedFragments
}

export interface NamedFragments {
  namedFragmentsJSON: string
  footer?: string
  coldStartPickupInfo?: string
}

export interface Item {
  index: number
  value: string
  even: boolean
  first: boolean
  position: number
  last: boolean
}

export interface LevelTextAssets {
  namedTextAssets: NamedTextAssets
}

export interface NamedTextAssets {
  filterButtonText?: string
  recommendationSectionHeader?: string
  pickupHeaderNear?: string
  pickupHeader?: string
  deliveryHeader?: string
  storeSelectionButtonText?: string
}

export interface ProductLocatorMeta {
  dimensionsVariations: DimensionsVariations
  products: Product[]
  prices: Prices
  displayValues: DisplayValues
  imageDictionary: ImageDictionary
}

export interface DimensionsVariations {
  dimensionCapacity: DimensionRecord[]
  carrierModel?: DimensionRecord[]
  dimensionScreensize?: DimensionRecord[]
  dimensionColor: DimensionColor[]
}

export interface DimensionRecord {
  key: string
  value?: string
  sortOrder: number
}

export interface DimensionColor {
  key: string
  value: string
  swatchImage: SwatchImage
  sortOrder: number
}

export interface SwatchImage {
  sources: Source[]
  width: string
  height: string
  attrs: string
  imageName: string
  originalImageName: string
  alt: string
  noImage: boolean
  deferSrc: boolean
  singleElementSources: boolean
  scaleFactor: string
}

export interface Source {
  srcSet: string
  type: string
}

export interface Product {
  productTitle: string
  basePartNumber: string
  image: string
  dimensionCapacity: string
  carrierModel: string
  price: string
  dimensionScreensize: string
  partNumber: string
  productLink: string
  dimensionColor: string
}

export interface Prices {
  [key: string]: PriceValue
}

export interface PriceValue {
  iupPrice?: string
  ipiPrice?: string
  bfiPrice?: string
  fullPrice: string
  carrierInstallment?: string
}

export interface DisplayValues {
  items: Item[]
  size: number
}

export interface Value {
  dimensionLabel: string
  showDisabledSelectors: boolean
  dimensionValue: string
}

export interface ImageDictionary {
  [key: string]: ImageDictionaryValue
}

export interface ImageDictionaryValue {
  sources: Source[]
  width: string
  height: string
  attrs: string
  imageName: string
  originalImageName: string
  alt: string
  noImage: boolean
  deferSrc: boolean
  singleElementSources: boolean
  scaleFactor: string
}
