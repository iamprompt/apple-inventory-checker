export type PickupMessageRecommendations = {
  head: Head
  body: Body
}

export type Head = {
  status: string
  data: Data
}

export type Data = object

export type Body = {
  noSimilarModelsText: string
  availableStoresText: string
  availableStoreText: string
  PickupMessage: PickupMessage
}

export type PickupMessage = {
  stores: Store[]
  overlayInitiatedFromWarmStart: boolean
  viewMoreHoursLinkText: string
  storesCount: string
  little: boolean
  location: string
  notAvailableNearby: string
  notAvailableNearOneStore: string
  warmDudeWithAPU: boolean
  viewMoreHoursVoText: string
  availability: Availability
  viewDetailsText: string
  legendLabelText: string
  filteredTopStore: boolean
  recommendedProducts: string[]
}

export type Store = {
  storeEmail: string
  storeName: string
  reservationUrl: string
  makeReservationUrl: string
  storeImageUrl: string
  country: string
  city: string
  storeNumber: string
  partsAvailability: PartsAvailability
  phoneNumber: string
  pickupTypeAvailabilityText: string
  address: Address
  hoursUrl: string
  storeHours: StoreHours
  storelatitude: number
  storelongitude: number
  storedistance: number
  storeDistanceWithUnit: string
  storeDistanceVoText: string
  retailStore: RetailStore
  storelistnumber: number
  storeListNumber: number
  pickupOptionsDetails: PickupOptionsDetails
  rank: number
}

export type PartsAvailability = {
  [partNumber: string]: PartAvailability
}

export type PartAvailability = {
  storePickEligible: boolean
  pickupSearchQuote: string
  partNumber: string
  purchaseOption: string
  ctoOptions: string
  pickupDisplay: string
  pickupType: string
  messageTypes: MessageTypes
  buyability: Buyability
}

export type MessageTypes = {
  regular: Regular
}

export type Regular = {
  storeSearchEnabled: boolean
  storePickupLabel: string
  storeSelectionEnabled: boolean
  storePickupQuote: string
  storePickupQuote2_0: string
  storePickupLinkText: string
  storePickupProductTitle: string
}

export type Buyability = {
  isBuyable: boolean
  reason: string
  commitCodeId: number
  inventory: number
}

export type Address = {
  address: string
  address3: string
  address2: string
  postalCode: string
}

export type StoreHours = {
  storeHoursText: string
  bopisPickupDays: string
  bopisPickupHours: string
  hours: Hour[]
}

export type Hour = {
  storeTimings: string
  storeDays: string
}

export type RetailStore = {
  storeNumber: string
  storeUniqueId: string
  name: string
  storeTypeKey: string
  storeSubTypeKey: string
  storeType: string
  phoneNumber: string
  email: string
  carrierCode: any
  locationType: any
  latitude: number
  longitude: number
  address: StoreAddress
  urlKey: any
  directionsUrl: any
  storeImageUrl: string
  makeReservationUrl: string
  hoursAndInfoUrl: string
  storeHours: StoreHour[]
  storeHolidays: any[]
  secureStoreImageUrl: string
  distance: number
  distanceUnit: string
  distanceWithUnit: string
  timezone: string
  storeIsActive: boolean
  lastUpdated: number
  lastFetched: number
  dateStamp: string
  distanceSeparator: string
  nextAvailableDate: any
  storeHolidayLookAheadWindow: number
  driveDistanceWithUnit: any
  driveDistanceInMeters: any
  dynamicAttributes: DynamicAttributes
  storePickupMethodByType: StorePickupMethodByType
  storeTimings: any
  availableNow: boolean
}

export type StoreAddress = {
  title: any
  firstName: any
  middleName: any
  lastName: any
  suffix: any
  firstNamePhonetic: any
  lastNamePhonetic: any
  companyName: string
  street: string
  street2: string
  street3: any
  suburb: any
  city: string
  county: any
  district: string
  postalCode: string
  addressCode: any
  state: any
  province: any
  countryCode: string
  daytimePhoneSelected: any
  daytimePhoneAreaCode: any
  daytimePhone: string
  fullPhoneNumber: any
  eveningPhoneAreaCode: any
  eveningPhone: any
  mobilePhone: any
  mobilePhoneAreaCode: any
  emailAddress: any
  residenceStatus: any
  moveInDate: any
  subscriberId: any
  locationType: any
  carrierCode: any
  twoLineAddress: any
  metadata: any
  uuid: string
  geoCode: any
  label: any
  languageCode: string
  mailStop: any
  type: string
  addressSourceType: any
  outsideCityFlag: any
  primaryAddress: boolean
  businessAddress: boolean
  cityStateZip: any
  correctionResult: any
  verificationState: string
  result: any
  savedState: any
}

export type StoreHour = {
  storeDays: string
  voStoreDays: any
  storeTimings: string
}

export type DynamicAttributes = {}

export type StorePickupMethodByType = {
  INSTORE: Instore
}

export type Instore = {
  type: string
  services: string[]
  typeDirection: TypeDirection
  typeCoordinate: TypeCoordinate
  typeMeetupLocation: TypeMeetupLocation
}

export type TypeDirection = {
  directionByLocale: any
}

export type TypeCoordinate = {
  lat: number
  lon: number
}

export type TypeMeetupLocation = {
  meetingLocationByLocale: any
}

export type PickupOptionsDetails = {
  whatToExpectAtPickup: string
  comparePickupOptionsLink: string
  pickupOptions: PickupOption[]
}

export type PickupOption = {
  pickupOptionTitle: string
  pickupOptionDescription: string
  index: number
}

export type Availability = {
  isComingSoon: boolean
}
