export interface FulfillmentResponse {
  head: Head
  body: Body
}

export interface Head {
  status: string
  data: Record<string, unknown>
}

export interface Body {
  content: Content
}

export interface Content {
  pickupMessage: PickupMessage
}

export interface PickupMessage {
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
}

export interface Store {
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
  specialHours: SpecialHours
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

export interface PartsAvailability {
  [key: string]: PartsAvailabilityValue
}

export interface PartsAvailabilityValue {
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

export interface MessageTypes {
  regular: Regular
}

export interface Regular {
  storeSearchEnabled: boolean
  storePickupLabel: string
  storeSelectionEnabled: boolean
  storePickupQuote: string
  storePickupLinkText: string
  storePickupProductTitle: string
}

export interface Buyability {
  isBuyable: boolean
  reason: string
  commitCodeId: number
  inventory: number
}

export interface Address {
  address: string
  address3: string
  address2: string
  postalCode: string
}

export interface StoreHours {
  storeHoursText: string
  bopisPickupDays: string
  bopisPickupHours: string
  hours: Hour[]
}

export interface Hour {
  storeTimings: string
  storeDays: string
}

export interface SpecialHours {
  specialHoursText: string
  bopisPickupDays: string
  bopisPickupHours: string
  specialHoursData: SpecialHoursDaum[]
  viewAllSpecialHours: boolean
}

export interface SpecialHoursDaum {
  specialDays: string
  specialTimings: string
}

export interface RetailStore {
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
  address: Address2
  urlKey: any
  directionsUrl: any
  storeImageUrl: string
  makeReservationUrl: string
  hoursAndInfoUrl: string
  storeHours: StoreHour[]
  storeHolidays: StoreHoliday[]
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

export interface Address2 {
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

export interface StoreHour {
  storeDays: string
  voStoreDays: any
  storeTimings: string
}

export interface StoreHoliday {
  date: string
  description: string
  hours: string
  comments: string
  closed: boolean
}

export type DynamicAttributes = {}

export interface StorePickupMethodByType {
  INSTORE: Instore
}

export interface Instore {
  type: string
  services: string[]
  typeDirection: TypeDirection
  typeCoordinate: TypeCoordinate
  typeMeetupLocation: TypeMeetupLocation
}

export interface TypeDirection {
  directionByLocale: any
}

export interface TypeCoordinate {
  lat: number
  lon: number
}

export interface TypeMeetupLocation {
  meetingLocationByLocale: any
}

export interface PickupOptionsDetails {
  whatToExpectAtPickup: string
  comparePickupOptionsLink: string
  pickupOptions: PickupOption[]
}

export interface PickupOption {
  pickupOptionTitle: string
  pickupOptionDescription: string
  index: number
}

export interface Availability {
  isComingSoon: boolean
}
