
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Verification
 * 
 */
export type Verification = $Result.DefaultSelection<Prisma.$VerificationPayload>
/**
 * Model Payment
 * 
 */
export type Payment = $Result.DefaultSelection<Prisma.$PaymentPayload>
/**
 * Model UserOnboarding
 * 
 */
export type UserOnboarding = $Result.DefaultSelection<Prisma.$UserOnboardingPayload>
/**
 * Model Gallery
 * 
 */
export type Gallery = $Result.DefaultSelection<Prisma.$GalleryPayload>
/**
 * Model Photo
 * 
 */
export type Photo = $Result.DefaultSelection<Prisma.$PhotoPayload>
/**
 * Model StorageEvent
 * 
 */
export type StorageEvent = $Result.DefaultSelection<Prisma.$StorageEventPayload>
/**
 * Model Client
 * 
 */
export type Client = $Result.DefaultSelection<Prisma.$ClientPayload>
/**
 * Model GalleryClient
 * 
 */
export type GalleryClient = $Result.DefaultSelection<Prisma.$GalleryClientPayload>
/**
 * Model Album
 * 
 */
export type Album = $Result.DefaultSelection<Prisma.$AlbumPayload>
/**
 * Model AlbumPhoto
 * 
 */
export type AlbumPhoto = $Result.DefaultSelection<Prisma.$AlbumPhotoPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Plan: {
  FREE: 'FREE',
  STARTER: 'STARTER',
  PROFESSIONAL: 'PROFESSIONAL',
  STUDIO: 'STUDIO',
  ENTERPRISE: 'ENTERPRISE'
};

export type Plan = (typeof Plan)[keyof typeof Plan]


export const PlanType: {
  BEGGINER: 'BEGGINER',
  PRO: 'PRO',
  STUDIO: 'STUDIO'
};

export type PlanType = (typeof PlanType)[keyof typeof PlanType]


export const SubscriptionStatus: {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const UserType: {
  SOLO: 'SOLO',
  COMPANY: 'COMPANY'
};

export type UserType = (typeof UserType)[keyof typeof UserType]


export const PhotographyLevel: {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  PROFESSIONAL: 'PROFESSIONAL'
};

export type PhotographyLevel = (typeof PhotographyLevel)[keyof typeof PhotographyLevel]


export const ContactMethod: {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
  BOTH: 'BOTH'
};

export type ContactMethod = (typeof ContactMethod)[keyof typeof ContactMethod]

}

export type Plan = $Enums.Plan

export const Plan: typeof $Enums.Plan

export type PlanType = $Enums.PlanType

export const PlanType: typeof $Enums.PlanType

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type UserType = $Enums.UserType

export const UserType: typeof $Enums.UserType

export type PhotographyLevel = $Enums.PhotographyLevel

export const PhotographyLevel: typeof $Enums.PhotographyLevel

export type ContactMethod = $Enums.ContactMethod

export const ContactMethod: typeof $Enums.ContactMethod

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.verification`: Exposes CRUD operations for the **Verification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Verifications
    * const verifications = await prisma.verification.findMany()
    * ```
    */
  get verification(): Prisma.VerificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.payment`: Exposes CRUD operations for the **Payment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Payments
    * const payments = await prisma.payment.findMany()
    * ```
    */
  get payment(): Prisma.PaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userOnboarding`: Exposes CRUD operations for the **UserOnboarding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserOnboardings
    * const userOnboardings = await prisma.userOnboarding.findMany()
    * ```
    */
  get userOnboarding(): Prisma.UserOnboardingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gallery`: Exposes CRUD operations for the **Gallery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Galleries
    * const galleries = await prisma.gallery.findMany()
    * ```
    */
  get gallery(): Prisma.GalleryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.photo`: Exposes CRUD operations for the **Photo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Photos
    * const photos = await prisma.photo.findMany()
    * ```
    */
  get photo(): Prisma.PhotoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.storageEvent`: Exposes CRUD operations for the **StorageEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StorageEvents
    * const storageEvents = await prisma.storageEvent.findMany()
    * ```
    */
  get storageEvent(): Prisma.StorageEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.client`: Exposes CRUD operations for the **Client** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Clients
    * const clients = await prisma.client.findMany()
    * ```
    */
  get client(): Prisma.ClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.galleryClient`: Exposes CRUD operations for the **GalleryClient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GalleryClients
    * const galleryClients = await prisma.galleryClient.findMany()
    * ```
    */
  get galleryClient(): Prisma.GalleryClientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.album`: Exposes CRUD operations for the **Album** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Albums
    * const albums = await prisma.album.findMany()
    * ```
    */
  get album(): Prisma.AlbumDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.albumPhoto`: Exposes CRUD operations for the **AlbumPhoto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AlbumPhotos
    * const albumPhotos = await prisma.albumPhoto.findMany()
    * ```
    */
  get albumPhoto(): Prisma.AlbumPhotoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Account: 'Account',
    Verification: 'Verification',
    Payment: 'Payment',
    UserOnboarding: 'UserOnboarding',
    Gallery: 'Gallery',
    Photo: 'Photo',
    StorageEvent: 'StorageEvent',
    Client: 'Client',
    GalleryClient: 'GalleryClient',
    Album: 'Album',
    AlbumPhoto: 'AlbumPhoto'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "account" | "verification" | "payment" | "userOnboarding" | "gallery" | "photo" | "storageEvent" | "client" | "galleryClient" | "album" | "albumPhoto"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Verification: {
        payload: Prisma.$VerificationPayload<ExtArgs>
        fields: Prisma.VerificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findFirst: {
            args: Prisma.VerificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          findMany: {
            args: Prisma.VerificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          create: {
            args: Prisma.VerificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          createMany: {
            args: Prisma.VerificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          delete: {
            args: Prisma.VerificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          update: {
            args: Prisma.VerificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          deleteMany: {
            args: Prisma.VerificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VerificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>[]
          }
          upsert: {
            args: Prisma.VerificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationPayload>
          }
          aggregate: {
            args: Prisma.VerificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerification>
          }
          groupBy: {
            args: Prisma.VerificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationCountAggregateOutputType> | number
          }
        }
      }
      Payment: {
        payload: Prisma.$PaymentPayload<ExtArgs>
        fields: Prisma.PaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findFirst: {
            args: Prisma.PaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          findMany: {
            args: Prisma.PaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          create: {
            args: Prisma.PaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          createMany: {
            args: Prisma.PaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          delete: {
            args: Prisma.PaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          update: {
            args: Prisma.PaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          deleteMany: {
            args: Prisma.PaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PaymentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>[]
          }
          upsert: {
            args: Prisma.PaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentPayload>
          }
          aggregate: {
            args: Prisma.PaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePayment>
          }
          groupBy: {
            args: Prisma.PaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentCountAggregateOutputType> | number
          }
        }
      }
      UserOnboarding: {
        payload: Prisma.$UserOnboardingPayload<ExtArgs>
        fields: Prisma.UserOnboardingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserOnboardingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserOnboardingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>
          }
          findFirst: {
            args: Prisma.UserOnboardingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserOnboardingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>
          }
          findMany: {
            args: Prisma.UserOnboardingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>[]
          }
          create: {
            args: Prisma.UserOnboardingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>
          }
          createMany: {
            args: Prisma.UserOnboardingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserOnboardingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>[]
          }
          delete: {
            args: Prisma.UserOnboardingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>
          }
          update: {
            args: Prisma.UserOnboardingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>
          }
          deleteMany: {
            args: Prisma.UserOnboardingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserOnboardingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserOnboardingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>[]
          }
          upsert: {
            args: Prisma.UserOnboardingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserOnboardingPayload>
          }
          aggregate: {
            args: Prisma.UserOnboardingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserOnboarding>
          }
          groupBy: {
            args: Prisma.UserOnboardingGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserOnboardingGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserOnboardingCountArgs<ExtArgs>
            result: $Utils.Optional<UserOnboardingCountAggregateOutputType> | number
          }
        }
      }
      Gallery: {
        payload: Prisma.$GalleryPayload<ExtArgs>
        fields: Prisma.GalleryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GalleryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GalleryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>
          }
          findFirst: {
            args: Prisma.GalleryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GalleryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>
          }
          findMany: {
            args: Prisma.GalleryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>[]
          }
          create: {
            args: Prisma.GalleryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>
          }
          createMany: {
            args: Prisma.GalleryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GalleryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>[]
          }
          delete: {
            args: Prisma.GalleryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>
          }
          update: {
            args: Prisma.GalleryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>
          }
          deleteMany: {
            args: Prisma.GalleryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GalleryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GalleryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>[]
          }
          upsert: {
            args: Prisma.GalleryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryPayload>
          }
          aggregate: {
            args: Prisma.GalleryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGallery>
          }
          groupBy: {
            args: Prisma.GalleryGroupByArgs<ExtArgs>
            result: $Utils.Optional<GalleryGroupByOutputType>[]
          }
          count: {
            args: Prisma.GalleryCountArgs<ExtArgs>
            result: $Utils.Optional<GalleryCountAggregateOutputType> | number
          }
        }
      }
      Photo: {
        payload: Prisma.$PhotoPayload<ExtArgs>
        fields: Prisma.PhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findFirst: {
            args: Prisma.PhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findMany: {
            args: Prisma.PhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          create: {
            args: Prisma.PhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          createMany: {
            args: Prisma.PhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          delete: {
            args: Prisma.PhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          update: {
            args: Prisma.PhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          deleteMany: {
            args: Prisma.PhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PhotoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          upsert: {
            args: Prisma.PhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          aggregate: {
            args: Prisma.PhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhoto>
          }
          groupBy: {
            args: Prisma.PhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhotoCountArgs<ExtArgs>
            result: $Utils.Optional<PhotoCountAggregateOutputType> | number
          }
        }
      }
      StorageEvent: {
        payload: Prisma.$StorageEventPayload<ExtArgs>
        fields: Prisma.StorageEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StorageEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StorageEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>
          }
          findFirst: {
            args: Prisma.StorageEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StorageEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>
          }
          findMany: {
            args: Prisma.StorageEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>[]
          }
          create: {
            args: Prisma.StorageEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>
          }
          createMany: {
            args: Prisma.StorageEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StorageEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>[]
          }
          delete: {
            args: Prisma.StorageEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>
          }
          update: {
            args: Prisma.StorageEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>
          }
          deleteMany: {
            args: Prisma.StorageEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StorageEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StorageEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>[]
          }
          upsert: {
            args: Prisma.StorageEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageEventPayload>
          }
          aggregate: {
            args: Prisma.StorageEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStorageEvent>
          }
          groupBy: {
            args: Prisma.StorageEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<StorageEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.StorageEventCountArgs<ExtArgs>
            result: $Utils.Optional<StorageEventCountAggregateOutputType> | number
          }
        }
      }
      Client: {
        payload: Prisma.$ClientPayload<ExtArgs>
        fields: Prisma.ClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findFirst: {
            args: Prisma.ClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          findMany: {
            args: Prisma.ClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          create: {
            args: Prisma.ClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          createMany: {
            args: Prisma.ClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          delete: {
            args: Prisma.ClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          update: {
            args: Prisma.ClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          deleteMany: {
            args: Prisma.ClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ClientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>[]
          }
          upsert: {
            args: Prisma.ClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ClientPayload>
          }
          aggregate: {
            args: Prisma.ClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateClient>
          }
          groupBy: {
            args: Prisma.ClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<ClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.ClientCountArgs<ExtArgs>
            result: $Utils.Optional<ClientCountAggregateOutputType> | number
          }
        }
      }
      GalleryClient: {
        payload: Prisma.$GalleryClientPayload<ExtArgs>
        fields: Prisma.GalleryClientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GalleryClientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GalleryClientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>
          }
          findFirst: {
            args: Prisma.GalleryClientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GalleryClientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>
          }
          findMany: {
            args: Prisma.GalleryClientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>[]
          }
          create: {
            args: Prisma.GalleryClientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>
          }
          createMany: {
            args: Prisma.GalleryClientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GalleryClientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>[]
          }
          delete: {
            args: Prisma.GalleryClientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>
          }
          update: {
            args: Prisma.GalleryClientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>
          }
          deleteMany: {
            args: Prisma.GalleryClientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GalleryClientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GalleryClientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>[]
          }
          upsert: {
            args: Prisma.GalleryClientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GalleryClientPayload>
          }
          aggregate: {
            args: Prisma.GalleryClientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGalleryClient>
          }
          groupBy: {
            args: Prisma.GalleryClientGroupByArgs<ExtArgs>
            result: $Utils.Optional<GalleryClientGroupByOutputType>[]
          }
          count: {
            args: Prisma.GalleryClientCountArgs<ExtArgs>
            result: $Utils.Optional<GalleryClientCountAggregateOutputType> | number
          }
        }
      }
      Album: {
        payload: Prisma.$AlbumPayload<ExtArgs>
        fields: Prisma.AlbumFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlbumFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlbumFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>
          }
          findFirst: {
            args: Prisma.AlbumFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlbumFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>
          }
          findMany: {
            args: Prisma.AlbumFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>[]
          }
          create: {
            args: Prisma.AlbumCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>
          }
          createMany: {
            args: Prisma.AlbumCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlbumCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>[]
          }
          delete: {
            args: Prisma.AlbumDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>
          }
          update: {
            args: Prisma.AlbumUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>
          }
          deleteMany: {
            args: Prisma.AlbumDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlbumUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AlbumUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>[]
          }
          upsert: {
            args: Prisma.AlbumUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPayload>
          }
          aggregate: {
            args: Prisma.AlbumAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlbum>
          }
          groupBy: {
            args: Prisma.AlbumGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlbumGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlbumCountArgs<ExtArgs>
            result: $Utils.Optional<AlbumCountAggregateOutputType> | number
          }
        }
      }
      AlbumPhoto: {
        payload: Prisma.$AlbumPhotoPayload<ExtArgs>
        fields: Prisma.AlbumPhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AlbumPhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AlbumPhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          findFirst: {
            args: Prisma.AlbumPhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AlbumPhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          findMany: {
            args: Prisma.AlbumPhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>[]
          }
          create: {
            args: Prisma.AlbumPhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          createMany: {
            args: Prisma.AlbumPhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AlbumPhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>[]
          }
          delete: {
            args: Prisma.AlbumPhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          update: {
            args: Prisma.AlbumPhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          deleteMany: {
            args: Prisma.AlbumPhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AlbumPhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AlbumPhotoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>[]
          }
          upsert: {
            args: Prisma.AlbumPhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AlbumPhotoPayload>
          }
          aggregate: {
            args: Prisma.AlbumPhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAlbumPhoto>
          }
          groupBy: {
            args: Prisma.AlbumPhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<AlbumPhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.AlbumPhotoCountArgs<ExtArgs>
            result: $Utils.Optional<AlbumPhotoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    account?: AccountOmit
    verification?: VerificationOmit
    payment?: PaymentOmit
    userOnboarding?: UserOnboardingOmit
    gallery?: GalleryOmit
    photo?: PhotoOmit
    storageEvent?: StorageEventOmit
    client?: ClientOmit
    galleryClient?: GalleryClientOmit
    album?: AlbumOmit
    albumPhoto?: AlbumPhotoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    accounts: number
    payment: number
    galleries: number
    clients: number
    storageEvents: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    payment?: boolean | UserCountOutputTypeCountPaymentArgs
    galleries?: boolean | UserCountOutputTypeCountGalleriesArgs
    clients?: boolean | UserCountOutputTypeCountClientsArgs
    storageEvents?: boolean | UserCountOutputTypeCountStorageEventsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGalleriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStorageEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StorageEventWhereInput
  }


  /**
   * Count Type GalleryCountOutputType
   */

  export type GalleryCountOutputType = {
    photos: number
    albums: number
    clients: number
  }

  export type GalleryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | GalleryCountOutputTypeCountPhotosArgs
    albums?: boolean | GalleryCountOutputTypeCountAlbumsArgs
    clients?: boolean | GalleryCountOutputTypeCountClientsArgs
  }

  // Custom InputTypes
  /**
   * GalleryCountOutputType without action
   */
  export type GalleryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryCountOutputType
     */
    select?: GalleryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GalleryCountOutputType without action
   */
  export type GalleryCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
  }

  /**
   * GalleryCountOutputType without action
   */
  export type GalleryCountOutputTypeCountAlbumsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumWhereInput
  }

  /**
   * GalleryCountOutputType without action
   */
  export type GalleryCountOutputTypeCountClientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryClientWhereInput
  }


  /**
   * Count Type PhotoCountOutputType
   */

  export type PhotoCountOutputType = {
    usedAsCoverIn: number
    albumPhotos: number
  }

  export type PhotoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usedAsCoverIn?: boolean | PhotoCountOutputTypeCountUsedAsCoverInArgs
    albumPhotos?: boolean | PhotoCountOutputTypeCountAlbumPhotosArgs
  }

  // Custom InputTypes
  /**
   * PhotoCountOutputType without action
   */
  export type PhotoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoCountOutputType
     */
    select?: PhotoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PhotoCountOutputType without action
   */
  export type PhotoCountOutputTypeCountUsedAsCoverInArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryWhereInput
  }

  /**
   * PhotoCountOutputType without action
   */
  export type PhotoCountOutputTypeCountAlbumPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumPhotoWhereInput
  }


  /**
   * Count Type ClientCountOutputType
   */

  export type ClientCountOutputType = {
    galleries: number
  }

  export type ClientCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    galleries?: boolean | ClientCountOutputTypeCountGalleriesArgs
  }

  // Custom InputTypes
  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ClientCountOutputType
     */
    select?: ClientCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ClientCountOutputType without action
   */
  export type ClientCountOutputTypeCountGalleriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryClientWhereInput
  }


  /**
   * Count Type AlbumCountOutputType
   */

  export type AlbumCountOutputType = {
    photos: number
  }

  export type AlbumCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | AlbumCountOutputTypeCountPhotosArgs
  }

  // Custom InputTypes
  /**
   * AlbumCountOutputType without action
   */
  export type AlbumCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumCountOutputType
     */
    select?: AlbumCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AlbumCountOutputType without action
   */
  export type AlbumCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumPhotoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    storageUsed: number | null
    storageLimit: number | null
    overageBytes: number | null
  }

  export type UserSumAggregateOutputType = {
    storageUsed: bigint | null
    storageLimit: bigint | null
    overageBytes: bigint | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    plan: $Enums.Plan | null
    storageUsed: bigint | null
    storageLimit: bigint | null
    overageBytes: bigint | null
    overageResetAt: Date | null
    stripeCustomerId: string | null
    stripeSubId: string | null
    warningEmailSent80: boolean | null
    warningEmailSent95: boolean | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    subscribed: boolean | null
    finishOnboarding: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    plan: $Enums.Plan | null
    storageUsed: bigint | null
    storageLimit: bigint | null
    overageBytes: bigint | null
    overageResetAt: Date | null
    stripeCustomerId: string | null
    stripeSubId: string | null
    warningEmailSent80: boolean | null
    warningEmailSent95: boolean | null
    emailVerified: boolean | null
    image: string | null
    createdAt: Date | null
    updatedAt: Date | null
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    subscribed: boolean | null
    finishOnboarding: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    plan: number
    storageUsed: number
    storageLimit: number
    overageBytes: number
    overageResetAt: number
    stripeCustomerId: number
    stripeSubId: number
    warningEmailSent80: number
    warningEmailSent95: number
    emailVerified: number
    image: number
    createdAt: number
    updatedAt: number
    role: number
    banned: number
    banReason: number
    banExpires: number
    subscribed: number
    finishOnboarding: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    storageUsed?: true
    storageLimit?: true
    overageBytes?: true
  }

  export type UserSumAggregateInputType = {
    storageUsed?: true
    storageLimit?: true
    overageBytes?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    plan?: true
    storageUsed?: true
    storageLimit?: true
    overageBytes?: true
    overageResetAt?: true
    stripeCustomerId?: true
    stripeSubId?: true
    warningEmailSent80?: true
    warningEmailSent95?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    subscribed?: true
    finishOnboarding?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    plan?: true
    storageUsed?: true
    storageLimit?: true
    overageBytes?: true
    overageResetAt?: true
    stripeCustomerId?: true
    stripeSubId?: true
    warningEmailSent80?: true
    warningEmailSent95?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    subscribed?: true
    finishOnboarding?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    plan?: true
    storageUsed?: true
    storageLimit?: true
    overageBytes?: true
    overageResetAt?: true
    stripeCustomerId?: true
    stripeSubId?: true
    warningEmailSent80?: true
    warningEmailSent95?: true
    emailVerified?: true
    image?: true
    createdAt?: true
    updatedAt?: true
    role?: true
    banned?: true
    banReason?: true
    banExpires?: true
    subscribed?: true
    finishOnboarding?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    plan: $Enums.Plan
    storageUsed: bigint
    storageLimit: bigint
    overageBytes: bigint
    overageResetAt: Date | null
    stripeCustomerId: string | null
    stripeSubId: string | null
    warningEmailSent80: boolean
    warningEmailSent95: boolean
    emailVerified: boolean
    image: string | null
    createdAt: Date
    updatedAt: Date
    role: string | null
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    subscribed: boolean | null
    finishOnboarding: boolean | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    plan?: boolean
    storageUsed?: boolean
    storageLimit?: boolean
    overageBytes?: boolean
    overageResetAt?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    subscribed?: boolean
    finishOnboarding?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    payment?: boolean | User$paymentArgs<ExtArgs>
    userOnboarding?: boolean | User$userOnboardingArgs<ExtArgs>
    galleries?: boolean | User$galleriesArgs<ExtArgs>
    clients?: boolean | User$clientsArgs<ExtArgs>
    storageEvents?: boolean | User$storageEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    plan?: boolean
    storageUsed?: boolean
    storageLimit?: boolean
    overageBytes?: boolean
    overageResetAt?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    subscribed?: boolean
    finishOnboarding?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    plan?: boolean
    storageUsed?: boolean
    storageLimit?: boolean
    overageBytes?: boolean
    overageResetAt?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    subscribed?: boolean
    finishOnboarding?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    plan?: boolean
    storageUsed?: boolean
    storageLimit?: boolean
    overageBytes?: boolean
    overageResetAt?: boolean
    stripeCustomerId?: boolean
    stripeSubId?: boolean
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified?: boolean
    image?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    role?: boolean
    banned?: boolean
    banReason?: boolean
    banExpires?: boolean
    subscribed?: boolean
    finishOnboarding?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "plan" | "storageUsed" | "storageLimit" | "overageBytes" | "overageResetAt" | "stripeCustomerId" | "stripeSubId" | "warningEmailSent80" | "warningEmailSent95" | "emailVerified" | "image" | "createdAt" | "updatedAt" | "role" | "banned" | "banReason" | "banExpires" | "subscribed" | "finishOnboarding", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    accounts?: boolean | User$accountsArgs<ExtArgs>
    payment?: boolean | User$paymentArgs<ExtArgs>
    userOnboarding?: boolean | User$userOnboardingArgs<ExtArgs>
    galleries?: boolean | User$galleriesArgs<ExtArgs>
    clients?: boolean | User$clientsArgs<ExtArgs>
    storageEvents?: boolean | User$storageEventsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      payment: Prisma.$PaymentPayload<ExtArgs>[]
      userOnboarding: Prisma.$UserOnboardingPayload<ExtArgs> | null
      galleries: Prisma.$GalleryPayload<ExtArgs>[]
      clients: Prisma.$ClientPayload<ExtArgs>[]
      storageEvents: Prisma.$StorageEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      plan: $Enums.Plan
      storageUsed: bigint
      storageLimit: bigint
      overageBytes: bigint
      overageResetAt: Date | null
      stripeCustomerId: string | null
      stripeSubId: string | null
      warningEmailSent80: boolean
      warningEmailSent95: boolean
      emailVerified: boolean
      image: string | null
      createdAt: Date
      updatedAt: Date
      role: string | null
      banned: boolean | null
      banReason: string | null
      banExpires: Date | null
      subscribed: boolean | null
      finishOnboarding: boolean | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payment<T extends User$paymentArgs<ExtArgs> = {}>(args?: Subset<T, User$paymentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userOnboarding<T extends User$userOnboardingArgs<ExtArgs> = {}>(args?: Subset<T, User$userOnboardingArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    galleries<T extends User$galleriesArgs<ExtArgs> = {}>(args?: Subset<T, User$galleriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    clients<T extends User$clientsArgs<ExtArgs> = {}>(args?: Subset<T, User$clientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    storageEvents<T extends User$storageEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$storageEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly plan: FieldRef<"User", 'Plan'>
    readonly storageUsed: FieldRef<"User", 'BigInt'>
    readonly storageLimit: FieldRef<"User", 'BigInt'>
    readonly overageBytes: FieldRef<"User", 'BigInt'>
    readonly overageResetAt: FieldRef<"User", 'DateTime'>
    readonly stripeCustomerId: FieldRef<"User", 'String'>
    readonly stripeSubId: FieldRef<"User", 'String'>
    readonly warningEmailSent80: FieldRef<"User", 'Boolean'>
    readonly warningEmailSent95: FieldRef<"User", 'Boolean'>
    readonly emailVerified: FieldRef<"User", 'Boolean'>
    readonly image: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly role: FieldRef<"User", 'String'>
    readonly banned: FieldRef<"User", 'Boolean'>
    readonly banReason: FieldRef<"User", 'String'>
    readonly banExpires: FieldRef<"User", 'DateTime'>
    readonly subscribed: FieldRef<"User", 'Boolean'>
    readonly finishOnboarding: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.payment
   */
  export type User$paymentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    cursor?: PaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * User.userOnboarding
   */
  export type User$userOnboardingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    where?: UserOnboardingWhereInput
  }

  /**
   * User.galleries
   */
  export type User$galleriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    where?: GalleryWhereInput
    orderBy?: GalleryOrderByWithRelationInput | GalleryOrderByWithRelationInput[]
    cursor?: GalleryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GalleryScalarFieldEnum | GalleryScalarFieldEnum[]
  }

  /**
   * User.clients
   */
  export type User$clientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    cursor?: ClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * User.storageEvents
   */
  export type User$storageEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    where?: StorageEventWhereInput
    orderBy?: StorageEventOrderByWithRelationInput | StorageEventOrderByWithRelationInput[]
    cursor?: StorageEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StorageEventScalarFieldEnum | StorageEventScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    impersonatedBy: string | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    expiresAt: Date | null
    token: string | null
    createdAt: Date | null
    updatedAt: Date | null
    ipAddress: string | null
    userAgent: string | null
    userId: string | null
    impersonatedBy: string | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    expiresAt: number
    token: number
    createdAt: number
    updatedAt: number
    ipAddress: number
    userAgent: number
    userId: number
    impersonatedBy: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    impersonatedBy?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    impersonatedBy?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    expiresAt?: true
    token?: true
    createdAt?: true
    updatedAt?: true
    ipAddress?: true
    userAgent?: true
    userId?: true
    impersonatedBy?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    expiresAt: Date
    token: string
    createdAt: Date
    updatedAt: Date
    ipAddress: string | null
    userAgent: string | null
    userId: string
    impersonatedBy: string | null
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    expiresAt?: boolean
    token?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    userId?: boolean
    impersonatedBy?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "expiresAt" | "token" | "createdAt" | "updatedAt" | "ipAddress" | "userAgent" | "userId" | "impersonatedBy", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      expiresAt: Date
      token: string
      createdAt: Date
      updatedAt: Date
      ipAddress: string | null
      userAgent: string | null
      userId: string
      impersonatedBy: string | null
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly expiresAt: FieldRef<"Session", 'DateTime'>
    readonly token: FieldRef<"Session", 'String'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
    readonly ipAddress: FieldRef<"Session", 'String'>
    readonly userAgent: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly impersonatedBy: FieldRef<"Session", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    accountId: string | null
    providerId: string | null
    userId: string | null
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    accountId: number
    providerId: number
    userId: number
    accessToken: number
    refreshToken: number
    idToken: number
    accessTokenExpiresAt: number
    refreshTokenExpiresAt: number
    scope: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    accountId?: true
    providerId?: true
    userId?: true
    accessToken?: true
    refreshToken?: true
    idToken?: true
    accessTokenExpiresAt?: true
    refreshTokenExpiresAt?: true
    scope?: true
    password?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    accountId: string
    providerId: string
    userId: string
    accessToken: string | null
    refreshToken: string | null
    idToken: string | null
    accessTokenExpiresAt: Date | null
    refreshTokenExpiresAt: Date | null
    scope: string | null
    password: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    accountId?: boolean
    providerId?: boolean
    userId?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    idToken?: boolean
    accessTokenExpiresAt?: boolean
    refreshTokenExpiresAt?: boolean
    scope?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "accountId" | "providerId" | "userId" | "accessToken" | "refreshToken" | "idToken" | "accessTokenExpiresAt" | "refreshTokenExpiresAt" | "scope" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      accountId: string
      providerId: string
      userId: string
      accessToken: string | null
      refreshToken: string | null
      idToken: string | null
      accessTokenExpiresAt: Date | null
      refreshTokenExpiresAt: Date | null
      scope: string | null
      password: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly accountId: FieldRef<"Account", 'String'>
    readonly providerId: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly accessTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly refreshTokenExpiresAt: FieldRef<"Account", 'DateTime'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly password: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Verification
   */

  export type AggregateVerification = {
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  export type VerificationMinAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationMaxAggregateOutputType = {
    id: string | null
    identifier: string | null
    value: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type VerificationCountAggregateOutputType = {
    id: number
    identifier: number
    value: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type VerificationMinAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationMaxAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type VerificationCountAggregateInputType = {
    id?: true
    identifier?: true
    value?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type VerificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verification to aggregate.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Verifications
    **/
    _count?: true | VerificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationMaxAggregateInputType
  }

  export type GetVerificationAggregateType<T extends VerificationAggregateArgs> = {
        [P in keyof T & keyof AggregateVerification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerification[P]>
      : GetScalarType<T[P], AggregateVerification[P]>
  }




  export type VerificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationWhereInput
    orderBy?: VerificationOrderByWithAggregationInput | VerificationOrderByWithAggregationInput[]
    by: VerificationScalarFieldEnum[] | VerificationScalarFieldEnum
    having?: VerificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationCountAggregateInputType | true
    _min?: VerificationMinAggregateInputType
    _max?: VerificationMaxAggregateInputType
  }

  export type VerificationGroupByOutputType = {
    id: string
    identifier: string
    value: string
    expiresAt: Date
    createdAt: Date | null
    updatedAt: Date | null
    _count: VerificationCountAggregateOutputType | null
    _min: VerificationMinAggregateOutputType | null
    _max: VerificationMaxAggregateOutputType | null
  }

  type GetVerificationGroupByPayload<T extends VerificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationGroupByOutputType[P]>
        }
      >
    >


  export type VerificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["verification"]>

  export type VerificationSelectScalar = {
    id?: boolean
    identifier?: boolean
    value?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type VerificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "identifier" | "value" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["verification"]>

  export type $VerificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Verification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      identifier: string
      value: string
      expiresAt: Date
      createdAt: Date | null
      updatedAt: Date | null
    }, ExtArgs["result"]["verification"]>
    composites: {}
  }

  type VerificationGetPayload<S extends boolean | null | undefined | VerificationDefaultArgs> = $Result.GetResult<Prisma.$VerificationPayload, S>

  type VerificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VerificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VerificationCountAggregateInputType | true
    }

  export interface VerificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Verification'], meta: { name: 'Verification' } }
    /**
     * Find zero or one Verification that matches the filter.
     * @param {VerificationFindUniqueArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationFindUniqueArgs>(args: SelectSubset<T, VerificationFindUniqueArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Verification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VerificationFindUniqueOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationFindFirstArgs>(args?: SelectSubset<T, VerificationFindFirstArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Verification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindFirstOrThrowArgs} args - Arguments to find a Verification
     * @example
     * // Get one Verification
     * const verification = await prisma.verification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Verifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Verifications
     * const verifications = await prisma.verification.findMany()
     * 
     * // Get first 10 Verifications
     * const verifications = await prisma.verification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const verificationWithIdOnly = await prisma.verification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VerificationFindManyArgs>(args?: SelectSubset<T, VerificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Verification.
     * @param {VerificationCreateArgs} args - Arguments to create a Verification.
     * @example
     * // Create one Verification
     * const Verification = await prisma.verification.create({
     *   data: {
     *     // ... data to create a Verification
     *   }
     * })
     * 
     */
    create<T extends VerificationCreateArgs>(args: SelectSubset<T, VerificationCreateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Verifications.
     * @param {VerificationCreateManyArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationCreateManyArgs>(args?: SelectSubset<T, VerificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Verifications and returns the data saved in the database.
     * @param {VerificationCreateManyAndReturnArgs} args - Arguments to create many Verifications.
     * @example
     * // Create many Verifications
     * const verification = await prisma.verification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Verification.
     * @param {VerificationDeleteArgs} args - Arguments to delete one Verification.
     * @example
     * // Delete one Verification
     * const Verification = await prisma.verification.delete({
     *   where: {
     *     // ... filter to delete one Verification
     *   }
     * })
     * 
     */
    delete<T extends VerificationDeleteArgs>(args: SelectSubset<T, VerificationDeleteArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Verification.
     * @param {VerificationUpdateArgs} args - Arguments to update one Verification.
     * @example
     * // Update one Verification
     * const verification = await prisma.verification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationUpdateArgs>(args: SelectSubset<T, VerificationUpdateArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Verifications.
     * @param {VerificationDeleteManyArgs} args - Arguments to filter Verifications to delete.
     * @example
     * // Delete a few Verifications
     * const { count } = await prisma.verification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationDeleteManyArgs>(args?: SelectSubset<T, VerificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationUpdateManyArgs>(args: SelectSubset<T, VerificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Verifications and returns the data updated in the database.
     * @param {VerificationUpdateManyAndReturnArgs} args - Arguments to update many Verifications.
     * @example
     * // Update many Verifications
     * const verification = await prisma.verification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Verifications and only return the `id`
     * const verificationWithIdOnly = await prisma.verification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VerificationUpdateManyAndReturnArgs>(args: SelectSubset<T, VerificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Verification.
     * @param {VerificationUpsertArgs} args - Arguments to update or create a Verification.
     * @example
     * // Update or create a Verification
     * const verification = await prisma.verification.upsert({
     *   create: {
     *     // ... data to create a Verification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Verification we want to update
     *   }
     * })
     */
    upsert<T extends VerificationUpsertArgs>(args: SelectSubset<T, VerificationUpsertArgs<ExtArgs>>): Prisma__VerificationClient<$Result.GetResult<Prisma.$VerificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Verifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationCountArgs} args - Arguments to filter Verifications to count.
     * @example
     * // Count the number of Verifications
     * const count = await prisma.verification.count({
     *   where: {
     *     // ... the filter for the Verifications we want to count
     *   }
     * })
    **/
    count<T extends VerificationCountArgs>(
      args?: Subset<T, VerificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationAggregateArgs>(args: Subset<T, VerificationAggregateArgs>): Prisma.PrismaPromise<GetVerificationAggregateType<T>>

    /**
     * Group by Verification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationGroupByArgs['orderBy'] }
        : { orderBy?: VerificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Verification model
   */
  readonly fields: VerificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Verification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Verification model
   */
  interface VerificationFieldRefs {
    readonly id: FieldRef<"Verification", 'String'>
    readonly identifier: FieldRef<"Verification", 'String'>
    readonly value: FieldRef<"Verification", 'String'>
    readonly expiresAt: FieldRef<"Verification", 'DateTime'>
    readonly createdAt: FieldRef<"Verification", 'DateTime'>
    readonly updatedAt: FieldRef<"Verification", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Verification findUnique
   */
  export type VerificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findUniqueOrThrow
   */
  export type VerificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification findFirst
   */
  export type VerificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findFirstOrThrow
   */
  export type VerificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verification to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Verifications.
     */
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification findMany
   */
  export type VerificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter, which Verifications to fetch.
     */
    where?: VerificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Verifications to fetch.
     */
    orderBy?: VerificationOrderByWithRelationInput | VerificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Verifications.
     */
    cursor?: VerificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Verifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Verifications.
     */
    skip?: number
    distinct?: VerificationScalarFieldEnum | VerificationScalarFieldEnum[]
  }

  /**
   * Verification create
   */
  export type VerificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to create a Verification.
     */
    data: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
  }

  /**
   * Verification createMany
   */
  export type VerificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification createManyAndReturn
   */
  export type VerificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to create many Verifications.
     */
    data: VerificationCreateManyInput | VerificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Verification update
   */
  export type VerificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data needed to update a Verification.
     */
    data: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
    /**
     * Choose, which Verification to update.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification updateMany
   */
  export type VerificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification updateManyAndReturn
   */
  export type VerificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The data used to update Verifications.
     */
    data: XOR<VerificationUpdateManyMutationInput, VerificationUncheckedUpdateManyInput>
    /**
     * Filter which Verifications to update
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to update.
     */
    limit?: number
  }

  /**
   * Verification upsert
   */
  export type VerificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * The filter to search for the Verification to update in case it exists.
     */
    where: VerificationWhereUniqueInput
    /**
     * In case the Verification found by the `where` argument doesn't exist, create a new Verification with this data.
     */
    create: XOR<VerificationCreateInput, VerificationUncheckedCreateInput>
    /**
     * In case the Verification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationUpdateInput, VerificationUncheckedUpdateInput>
  }

  /**
   * Verification delete
   */
  export type VerificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
    /**
     * Filter which Verification to delete.
     */
    where: VerificationWhereUniqueInput
  }

  /**
   * Verification deleteMany
   */
  export type VerificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Verifications to delete
     */
    where?: VerificationWhereInput
    /**
     * Limit how many Verifications to delete.
     */
    limit?: number
  }

  /**
   * Verification without action
   */
  export type VerificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Verification
     */
    select?: VerificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Verification
     */
    omit?: VerificationOmit<ExtArgs> | null
  }


  /**
   * Model Payment
   */

  export type AggregatePayment = {
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  export type PaymentAvgAggregateOutputType = {
    id: number | null
    planId: number | null
    amount_cents: number | null
    transactionId: number | null
    initial_transaction: number | null
    subscriptionId: number | null
  }

  export type PaymentSumAggregateOutputType = {
    id: number | null
    planId: number | null
    amount_cents: number | null
    transactionId: number | null
    initial_transaction: number | null
    subscriptionId: number | null
  }

  export type PaymentMinAggregateOutputType = {
    id: number | null
    planId: number | null
    plan: $Enums.PlanType | null
    planExpiresAt: Date | null
    planStartedAt: Date | null
    amount_cents: number | null
    transactionId: number | null
    initial_transaction: number | null
    subscriptionId: number | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.SubscriptionStatus | null
    userId: string | null
  }

  export type PaymentMaxAggregateOutputType = {
    id: number | null
    planId: number | null
    plan: $Enums.PlanType | null
    planExpiresAt: Date | null
    planStartedAt: Date | null
    amount_cents: number | null
    transactionId: number | null
    initial_transaction: number | null
    subscriptionId: number | null
    createdAt: Date | null
    updatedAt: Date | null
    status: $Enums.SubscriptionStatus | null
    userId: string | null
  }

  export type PaymentCountAggregateOutputType = {
    id: number
    planId: number
    plan: number
    planExpiresAt: number
    planStartedAt: number
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt: number
    updatedAt: number
    status: number
    userId: number
    _all: number
  }


  export type PaymentAvgAggregateInputType = {
    id?: true
    planId?: true
    amount_cents?: true
    transactionId?: true
    initial_transaction?: true
    subscriptionId?: true
  }

  export type PaymentSumAggregateInputType = {
    id?: true
    planId?: true
    amount_cents?: true
    transactionId?: true
    initial_transaction?: true
    subscriptionId?: true
  }

  export type PaymentMinAggregateInputType = {
    id?: true
    planId?: true
    plan?: true
    planExpiresAt?: true
    planStartedAt?: true
    amount_cents?: true
    transactionId?: true
    initial_transaction?: true
    subscriptionId?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    userId?: true
  }

  export type PaymentMaxAggregateInputType = {
    id?: true
    planId?: true
    plan?: true
    planExpiresAt?: true
    planStartedAt?: true
    amount_cents?: true
    transactionId?: true
    initial_transaction?: true
    subscriptionId?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    userId?: true
  }

  export type PaymentCountAggregateInputType = {
    id?: true
    planId?: true
    plan?: true
    planExpiresAt?: true
    planStartedAt?: true
    amount_cents?: true
    transactionId?: true
    initial_transaction?: true
    subscriptionId?: true
    createdAt?: true
    updatedAt?: true
    status?: true
    userId?: true
    _all?: true
  }

  export type PaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payment to aggregate.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Payments
    **/
    _count?: true | PaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentMaxAggregateInputType
  }

  export type GetPaymentAggregateType<T extends PaymentAggregateArgs> = {
        [P in keyof T & keyof AggregatePayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePayment[P]>
      : GetScalarType<T[P], AggregatePayment[P]>
  }




  export type PaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentWhereInput
    orderBy?: PaymentOrderByWithAggregationInput | PaymentOrderByWithAggregationInput[]
    by: PaymentScalarFieldEnum[] | PaymentScalarFieldEnum
    having?: PaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentCountAggregateInputType | true
    _avg?: PaymentAvgAggregateInputType
    _sum?: PaymentSumAggregateInputType
    _min?: PaymentMinAggregateInputType
    _max?: PaymentMaxAggregateInputType
  }

  export type PaymentGroupByOutputType = {
    id: number
    planId: number
    plan: $Enums.PlanType
    planExpiresAt: Date | null
    planStartedAt: Date | null
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt: Date
    updatedAt: Date
    status: $Enums.SubscriptionStatus
    userId: string
    _count: PaymentCountAggregateOutputType | null
    _avg: PaymentAvgAggregateOutputType | null
    _sum: PaymentSumAggregateOutputType | null
    _min: PaymentMinAggregateOutputType | null
    _max: PaymentMaxAggregateOutputType | null
  }

  type GetPaymentGroupByPayload<T extends PaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentGroupByOutputType[P]>
        }
      >
    >


  export type PaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planId?: boolean
    plan?: boolean
    planExpiresAt?: boolean
    planStartedAt?: boolean
    amount_cents?: boolean
    transactionId?: boolean
    initial_transaction?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planId?: boolean
    plan?: boolean
    planExpiresAt?: boolean
    planStartedAt?: boolean
    amount_cents?: boolean
    transactionId?: boolean
    initial_transaction?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    planId?: boolean
    plan?: boolean
    planExpiresAt?: boolean
    planStartedAt?: boolean
    amount_cents?: boolean
    transactionId?: boolean
    initial_transaction?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["payment"]>

  export type PaymentSelectScalar = {
    id?: boolean
    planId?: boolean
    plan?: boolean
    planExpiresAt?: boolean
    planStartedAt?: boolean
    amount_cents?: boolean
    transactionId?: boolean
    initial_transaction?: boolean
    subscriptionId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    status?: boolean
    userId?: boolean
  }

  export type PaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "planId" | "plan" | "planExpiresAt" | "planStartedAt" | "amount_cents" | "transactionId" | "initial_transaction" | "subscriptionId" | "createdAt" | "updatedAt" | "status" | "userId", ExtArgs["result"]["payment"]>
  export type PaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PaymentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Payment"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      planId: number
      plan: $Enums.PlanType
      planExpiresAt: Date | null
      planStartedAt: Date | null
      amount_cents: number
      transactionId: number
      initial_transaction: number
      subscriptionId: number
      createdAt: Date
      updatedAt: Date
      status: $Enums.SubscriptionStatus
      userId: string
    }, ExtArgs["result"]["payment"]>
    composites: {}
  }

  type PaymentGetPayload<S extends boolean | null | undefined | PaymentDefaultArgs> = $Result.GetResult<Prisma.$PaymentPayload, S>

  type PaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentCountAggregateInputType | true
    }

  export interface PaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Payment'], meta: { name: 'Payment' } }
    /**
     * Find zero or one Payment that matches the filter.
     * @param {PaymentFindUniqueArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentFindUniqueArgs>(args: SelectSubset<T, PaymentFindUniqueArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Payment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentFindUniqueOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentFindFirstArgs>(args?: SelectSubset<T, PaymentFindFirstArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Payment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindFirstOrThrowArgs} args - Arguments to find a Payment
     * @example
     * // Get one Payment
     * const payment = await prisma.payment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Payments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Payments
     * const payments = await prisma.payment.findMany()
     * 
     * // Get first 10 Payments
     * const payments = await prisma.payment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentWithIdOnly = await prisma.payment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentFindManyArgs>(args?: SelectSubset<T, PaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Payment.
     * @param {PaymentCreateArgs} args - Arguments to create a Payment.
     * @example
     * // Create one Payment
     * const Payment = await prisma.payment.create({
     *   data: {
     *     // ... data to create a Payment
     *   }
     * })
     * 
     */
    create<T extends PaymentCreateArgs>(args: SelectSubset<T, PaymentCreateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Payments.
     * @param {PaymentCreateManyArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentCreateManyArgs>(args?: SelectSubset<T, PaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Payments and returns the data saved in the database.
     * @param {PaymentCreateManyAndReturnArgs} args - Arguments to create many Payments.
     * @example
     * // Create many Payments
     * const payment = await prisma.payment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PaymentCreateManyAndReturnArgs>(args?: SelectSubset<T, PaymentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Payment.
     * @param {PaymentDeleteArgs} args - Arguments to delete one Payment.
     * @example
     * // Delete one Payment
     * const Payment = await prisma.payment.delete({
     *   where: {
     *     // ... filter to delete one Payment
     *   }
     * })
     * 
     */
    delete<T extends PaymentDeleteArgs>(args: SelectSubset<T, PaymentDeleteArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Payment.
     * @param {PaymentUpdateArgs} args - Arguments to update one Payment.
     * @example
     * // Update one Payment
     * const payment = await prisma.payment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentUpdateArgs>(args: SelectSubset<T, PaymentUpdateArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Payments.
     * @param {PaymentDeleteManyArgs} args - Arguments to filter Payments to delete.
     * @example
     * // Delete a few Payments
     * const { count } = await prisma.payment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentDeleteManyArgs>(args?: SelectSubset<T, PaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentUpdateManyArgs>(args: SelectSubset<T, PaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Payments and returns the data updated in the database.
     * @param {PaymentUpdateManyAndReturnArgs} args - Arguments to update many Payments.
     * @example
     * // Update many Payments
     * const payment = await prisma.payment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Payments and only return the `id`
     * const paymentWithIdOnly = await prisma.payment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PaymentUpdateManyAndReturnArgs>(args: SelectSubset<T, PaymentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Payment.
     * @param {PaymentUpsertArgs} args - Arguments to update or create a Payment.
     * @example
     * // Update or create a Payment
     * const payment = await prisma.payment.upsert({
     *   create: {
     *     // ... data to create a Payment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Payment we want to update
     *   }
     * })
     */
    upsert<T extends PaymentUpsertArgs>(args: SelectSubset<T, PaymentUpsertArgs<ExtArgs>>): Prisma__PaymentClient<$Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Payments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentCountArgs} args - Arguments to filter Payments to count.
     * @example
     * // Count the number of Payments
     * const count = await prisma.payment.count({
     *   where: {
     *     // ... the filter for the Payments we want to count
     *   }
     * })
    **/
    count<T extends PaymentCountArgs>(
      args?: Subset<T, PaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentAggregateArgs>(args: Subset<T, PaymentAggregateArgs>): Prisma.PrismaPromise<GetPaymentAggregateType<T>>

    /**
     * Group by Payment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentGroupByArgs['orderBy'] }
        : { orderBy?: PaymentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Payment model
   */
  readonly fields: PaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Payment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Payment model
   */
  interface PaymentFieldRefs {
    readonly id: FieldRef<"Payment", 'Int'>
    readonly planId: FieldRef<"Payment", 'Int'>
    readonly plan: FieldRef<"Payment", 'PlanType'>
    readonly planExpiresAt: FieldRef<"Payment", 'DateTime'>
    readonly planStartedAt: FieldRef<"Payment", 'DateTime'>
    readonly amount_cents: FieldRef<"Payment", 'Int'>
    readonly transactionId: FieldRef<"Payment", 'Int'>
    readonly initial_transaction: FieldRef<"Payment", 'Int'>
    readonly subscriptionId: FieldRef<"Payment", 'Int'>
    readonly createdAt: FieldRef<"Payment", 'DateTime'>
    readonly updatedAt: FieldRef<"Payment", 'DateTime'>
    readonly status: FieldRef<"Payment", 'SubscriptionStatus'>
    readonly userId: FieldRef<"Payment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Payment findUnique
   */
  export type PaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findUniqueOrThrow
   */
  export type PaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment findFirst
   */
  export type PaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findFirstOrThrow
   */
  export type PaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payment to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Payments.
     */
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment findMany
   */
  export type PaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter, which Payments to fetch.
     */
    where?: PaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Payments to fetch.
     */
    orderBy?: PaymentOrderByWithRelationInput | PaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Payments.
     */
    cursor?: PaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Payments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Payments.
     */
    skip?: number
    distinct?: PaymentScalarFieldEnum | PaymentScalarFieldEnum[]
  }

  /**
   * Payment create
   */
  export type PaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a Payment.
     */
    data: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
  }

  /**
   * Payment createMany
   */
  export type PaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Payment createManyAndReturn
   */
  export type PaymentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to create many Payments.
     */
    data: PaymentCreateManyInput | PaymentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment update
   */
  export type PaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a Payment.
     */
    data: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
    /**
     * Choose, which Payment to update.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment updateMany
   */
  export type PaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
  }

  /**
   * Payment updateManyAndReturn
   */
  export type PaymentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * The data used to update Payments.
     */
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyInput>
    /**
     * Filter which Payments to update
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Payment upsert
   */
  export type PaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the Payment to update in case it exists.
     */
    where: PaymentWhereUniqueInput
    /**
     * In case the Payment found by the `where` argument doesn't exist, create a new Payment with this data.
     */
    create: XOR<PaymentCreateInput, PaymentUncheckedCreateInput>
    /**
     * In case the Payment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentUpdateInput, PaymentUncheckedUpdateInput>
  }

  /**
   * Payment delete
   */
  export type PaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
    /**
     * Filter which Payment to delete.
     */
    where: PaymentWhereUniqueInput
  }

  /**
   * Payment deleteMany
   */
  export type PaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Payments to delete
     */
    where?: PaymentWhereInput
    /**
     * Limit how many Payments to delete.
     */
    limit?: number
  }

  /**
   * Payment without action
   */
  export type PaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Payment
     */
    select?: PaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Payment
     */
    omit?: PaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentInclude<ExtArgs> | null
  }


  /**
   * Model UserOnboarding
   */

  export type AggregateUserOnboarding = {
    _count: UserOnboardingCountAggregateOutputType | null
    _avg: UserOnboardingAvgAggregateOutputType | null
    _sum: UserOnboardingSumAggregateOutputType | null
    _min: UserOnboardingMinAggregateOutputType | null
    _max: UserOnboardingMaxAggregateOutputType | null
  }

  export type UserOnboardingAvgAggregateOutputType = {
    id: number | null
  }

  export type UserOnboardingSumAggregateOutputType = {
    id: number | null
  }

  export type UserOnboardingMinAggregateOutputType = {
    id: number | null
    userId: string | null
    userType: $Enums.UserType | null
    companyName: string | null
    companySize: string | null
    photographyLevel: $Enums.PhotographyLevel | null
    contactMethod: $Enums.ContactMethod | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserOnboardingMaxAggregateOutputType = {
    id: number | null
    userId: string | null
    userType: $Enums.UserType | null
    companyName: string | null
    companySize: string | null
    photographyLevel: $Enums.PhotographyLevel | null
    contactMethod: $Enums.ContactMethod | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserOnboardingCountAggregateOutputType = {
    id: number
    userId: number
    userType: number
    companyName: number
    companySize: number
    photographyType: number
    photographyLevel: number
    contactMethod: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserOnboardingAvgAggregateInputType = {
    id?: true
  }

  export type UserOnboardingSumAggregateInputType = {
    id?: true
  }

  export type UserOnboardingMinAggregateInputType = {
    id?: true
    userId?: true
    userType?: true
    companyName?: true
    companySize?: true
    photographyLevel?: true
    contactMethod?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserOnboardingMaxAggregateInputType = {
    id?: true
    userId?: true
    userType?: true
    companyName?: true
    companySize?: true
    photographyLevel?: true
    contactMethod?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserOnboardingCountAggregateInputType = {
    id?: true
    userId?: true
    userType?: true
    companyName?: true
    companySize?: true
    photographyType?: true
    photographyLevel?: true
    contactMethod?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserOnboardingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserOnboarding to aggregate.
     */
    where?: UserOnboardingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserOnboardings to fetch.
     */
    orderBy?: UserOnboardingOrderByWithRelationInput | UserOnboardingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserOnboardingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserOnboardings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserOnboardings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserOnboardings
    **/
    _count?: true | UserOnboardingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserOnboardingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserOnboardingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserOnboardingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserOnboardingMaxAggregateInputType
  }

  export type GetUserOnboardingAggregateType<T extends UserOnboardingAggregateArgs> = {
        [P in keyof T & keyof AggregateUserOnboarding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserOnboarding[P]>
      : GetScalarType<T[P], AggregateUserOnboarding[P]>
  }




  export type UserOnboardingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserOnboardingWhereInput
    orderBy?: UserOnboardingOrderByWithAggregationInput | UserOnboardingOrderByWithAggregationInput[]
    by: UserOnboardingScalarFieldEnum[] | UserOnboardingScalarFieldEnum
    having?: UserOnboardingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserOnboardingCountAggregateInputType | true
    _avg?: UserOnboardingAvgAggregateInputType
    _sum?: UserOnboardingSumAggregateInputType
    _min?: UserOnboardingMinAggregateInputType
    _max?: UserOnboardingMaxAggregateInputType
  }

  export type UserOnboardingGroupByOutputType = {
    id: number
    userId: string
    userType: $Enums.UserType
    companyName: string | null
    companySize: string | null
    photographyType: string[]
    photographyLevel: $Enums.PhotographyLevel | null
    contactMethod: $Enums.ContactMethod | null
    createdAt: Date
    updatedAt: Date
    _count: UserOnboardingCountAggregateOutputType | null
    _avg: UserOnboardingAvgAggregateOutputType | null
    _sum: UserOnboardingSumAggregateOutputType | null
    _min: UserOnboardingMinAggregateOutputType | null
    _max: UserOnboardingMaxAggregateOutputType | null
  }

  type GetUserOnboardingGroupByPayload<T extends UserOnboardingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserOnboardingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserOnboardingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserOnboardingGroupByOutputType[P]>
            : GetScalarType<T[P], UserOnboardingGroupByOutputType[P]>
        }
      >
    >


  export type UserOnboardingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userType?: boolean
    companyName?: boolean
    companySize?: boolean
    photographyType?: boolean
    photographyLevel?: boolean
    contactMethod?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userOnboarding"]>

  export type UserOnboardingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userType?: boolean
    companyName?: boolean
    companySize?: boolean
    photographyType?: boolean
    photographyLevel?: boolean
    contactMethod?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userOnboarding"]>

  export type UserOnboardingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    userType?: boolean
    companyName?: boolean
    companySize?: boolean
    photographyType?: boolean
    photographyLevel?: boolean
    contactMethod?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userOnboarding"]>

  export type UserOnboardingSelectScalar = {
    id?: boolean
    userId?: boolean
    userType?: boolean
    companyName?: boolean
    companySize?: boolean
    photographyType?: boolean
    photographyLevel?: boolean
    contactMethod?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOnboardingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "userType" | "companyName" | "companySize" | "photographyType" | "photographyLevel" | "contactMethod" | "createdAt" | "updatedAt", ExtArgs["result"]["userOnboarding"]>
  export type UserOnboardingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserOnboardingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserOnboardingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserOnboardingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserOnboarding"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: string
      userType: $Enums.UserType
      companyName: string | null
      companySize: string | null
      photographyType: string[]
      photographyLevel: $Enums.PhotographyLevel | null
      contactMethod: $Enums.ContactMethod | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userOnboarding"]>
    composites: {}
  }

  type UserOnboardingGetPayload<S extends boolean | null | undefined | UserOnboardingDefaultArgs> = $Result.GetResult<Prisma.$UserOnboardingPayload, S>

  type UserOnboardingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserOnboardingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserOnboardingCountAggregateInputType | true
    }

  export interface UserOnboardingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserOnboarding'], meta: { name: 'UserOnboarding' } }
    /**
     * Find zero or one UserOnboarding that matches the filter.
     * @param {UserOnboardingFindUniqueArgs} args - Arguments to find a UserOnboarding
     * @example
     * // Get one UserOnboarding
     * const userOnboarding = await prisma.userOnboarding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserOnboardingFindUniqueArgs>(args: SelectSubset<T, UserOnboardingFindUniqueArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserOnboarding that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserOnboardingFindUniqueOrThrowArgs} args - Arguments to find a UserOnboarding
     * @example
     * // Get one UserOnboarding
     * const userOnboarding = await prisma.userOnboarding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserOnboardingFindUniqueOrThrowArgs>(args: SelectSubset<T, UserOnboardingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserOnboarding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOnboardingFindFirstArgs} args - Arguments to find a UserOnboarding
     * @example
     * // Get one UserOnboarding
     * const userOnboarding = await prisma.userOnboarding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserOnboardingFindFirstArgs>(args?: SelectSubset<T, UserOnboardingFindFirstArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserOnboarding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOnboardingFindFirstOrThrowArgs} args - Arguments to find a UserOnboarding
     * @example
     * // Get one UserOnboarding
     * const userOnboarding = await prisma.userOnboarding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserOnboardingFindFirstOrThrowArgs>(args?: SelectSubset<T, UserOnboardingFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserOnboardings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOnboardingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserOnboardings
     * const userOnboardings = await prisma.userOnboarding.findMany()
     * 
     * // Get first 10 UserOnboardings
     * const userOnboardings = await prisma.userOnboarding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userOnboardingWithIdOnly = await prisma.userOnboarding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserOnboardingFindManyArgs>(args?: SelectSubset<T, UserOnboardingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserOnboarding.
     * @param {UserOnboardingCreateArgs} args - Arguments to create a UserOnboarding.
     * @example
     * // Create one UserOnboarding
     * const UserOnboarding = await prisma.userOnboarding.create({
     *   data: {
     *     // ... data to create a UserOnboarding
     *   }
     * })
     * 
     */
    create<T extends UserOnboardingCreateArgs>(args: SelectSubset<T, UserOnboardingCreateArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserOnboardings.
     * @param {UserOnboardingCreateManyArgs} args - Arguments to create many UserOnboardings.
     * @example
     * // Create many UserOnboardings
     * const userOnboarding = await prisma.userOnboarding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserOnboardingCreateManyArgs>(args?: SelectSubset<T, UserOnboardingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserOnboardings and returns the data saved in the database.
     * @param {UserOnboardingCreateManyAndReturnArgs} args - Arguments to create many UserOnboardings.
     * @example
     * // Create many UserOnboardings
     * const userOnboarding = await prisma.userOnboarding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserOnboardings and only return the `id`
     * const userOnboardingWithIdOnly = await prisma.userOnboarding.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserOnboardingCreateManyAndReturnArgs>(args?: SelectSubset<T, UserOnboardingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserOnboarding.
     * @param {UserOnboardingDeleteArgs} args - Arguments to delete one UserOnboarding.
     * @example
     * // Delete one UserOnboarding
     * const UserOnboarding = await prisma.userOnboarding.delete({
     *   where: {
     *     // ... filter to delete one UserOnboarding
     *   }
     * })
     * 
     */
    delete<T extends UserOnboardingDeleteArgs>(args: SelectSubset<T, UserOnboardingDeleteArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserOnboarding.
     * @param {UserOnboardingUpdateArgs} args - Arguments to update one UserOnboarding.
     * @example
     * // Update one UserOnboarding
     * const userOnboarding = await prisma.userOnboarding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserOnboardingUpdateArgs>(args: SelectSubset<T, UserOnboardingUpdateArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserOnboardings.
     * @param {UserOnboardingDeleteManyArgs} args - Arguments to filter UserOnboardings to delete.
     * @example
     * // Delete a few UserOnboardings
     * const { count } = await prisma.userOnboarding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserOnboardingDeleteManyArgs>(args?: SelectSubset<T, UserOnboardingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserOnboardings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOnboardingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserOnboardings
     * const userOnboarding = await prisma.userOnboarding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserOnboardingUpdateManyArgs>(args: SelectSubset<T, UserOnboardingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserOnboardings and returns the data updated in the database.
     * @param {UserOnboardingUpdateManyAndReturnArgs} args - Arguments to update many UserOnboardings.
     * @example
     * // Update many UserOnboardings
     * const userOnboarding = await prisma.userOnboarding.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserOnboardings and only return the `id`
     * const userOnboardingWithIdOnly = await prisma.userOnboarding.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserOnboardingUpdateManyAndReturnArgs>(args: SelectSubset<T, UserOnboardingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserOnboarding.
     * @param {UserOnboardingUpsertArgs} args - Arguments to update or create a UserOnboarding.
     * @example
     * // Update or create a UserOnboarding
     * const userOnboarding = await prisma.userOnboarding.upsert({
     *   create: {
     *     // ... data to create a UserOnboarding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserOnboarding we want to update
     *   }
     * })
     */
    upsert<T extends UserOnboardingUpsertArgs>(args: SelectSubset<T, UserOnboardingUpsertArgs<ExtArgs>>): Prisma__UserOnboardingClient<$Result.GetResult<Prisma.$UserOnboardingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserOnboardings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOnboardingCountArgs} args - Arguments to filter UserOnboardings to count.
     * @example
     * // Count the number of UserOnboardings
     * const count = await prisma.userOnboarding.count({
     *   where: {
     *     // ... the filter for the UserOnboardings we want to count
     *   }
     * })
    **/
    count<T extends UserOnboardingCountArgs>(
      args?: Subset<T, UserOnboardingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserOnboardingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserOnboarding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOnboardingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserOnboardingAggregateArgs>(args: Subset<T, UserOnboardingAggregateArgs>): Prisma.PrismaPromise<GetUserOnboardingAggregateType<T>>

    /**
     * Group by UserOnboarding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserOnboardingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserOnboardingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserOnboardingGroupByArgs['orderBy'] }
        : { orderBy?: UserOnboardingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserOnboardingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserOnboardingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserOnboarding model
   */
  readonly fields: UserOnboardingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserOnboarding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserOnboardingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserOnboarding model
   */
  interface UserOnboardingFieldRefs {
    readonly id: FieldRef<"UserOnboarding", 'Int'>
    readonly userId: FieldRef<"UserOnboarding", 'String'>
    readonly userType: FieldRef<"UserOnboarding", 'UserType'>
    readonly companyName: FieldRef<"UserOnboarding", 'String'>
    readonly companySize: FieldRef<"UserOnboarding", 'String'>
    readonly photographyType: FieldRef<"UserOnboarding", 'String[]'>
    readonly photographyLevel: FieldRef<"UserOnboarding", 'PhotographyLevel'>
    readonly contactMethod: FieldRef<"UserOnboarding", 'ContactMethod'>
    readonly createdAt: FieldRef<"UserOnboarding", 'DateTime'>
    readonly updatedAt: FieldRef<"UserOnboarding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserOnboarding findUnique
   */
  export type UserOnboardingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * Filter, which UserOnboarding to fetch.
     */
    where: UserOnboardingWhereUniqueInput
  }

  /**
   * UserOnboarding findUniqueOrThrow
   */
  export type UserOnboardingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * Filter, which UserOnboarding to fetch.
     */
    where: UserOnboardingWhereUniqueInput
  }

  /**
   * UserOnboarding findFirst
   */
  export type UserOnboardingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * Filter, which UserOnboarding to fetch.
     */
    where?: UserOnboardingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserOnboardings to fetch.
     */
    orderBy?: UserOnboardingOrderByWithRelationInput | UserOnboardingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserOnboardings.
     */
    cursor?: UserOnboardingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserOnboardings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserOnboardings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserOnboardings.
     */
    distinct?: UserOnboardingScalarFieldEnum | UserOnboardingScalarFieldEnum[]
  }

  /**
   * UserOnboarding findFirstOrThrow
   */
  export type UserOnboardingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * Filter, which UserOnboarding to fetch.
     */
    where?: UserOnboardingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserOnboardings to fetch.
     */
    orderBy?: UserOnboardingOrderByWithRelationInput | UserOnboardingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserOnboardings.
     */
    cursor?: UserOnboardingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserOnboardings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserOnboardings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserOnboardings.
     */
    distinct?: UserOnboardingScalarFieldEnum | UserOnboardingScalarFieldEnum[]
  }

  /**
   * UserOnboarding findMany
   */
  export type UserOnboardingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * Filter, which UserOnboardings to fetch.
     */
    where?: UserOnboardingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserOnboardings to fetch.
     */
    orderBy?: UserOnboardingOrderByWithRelationInput | UserOnboardingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserOnboardings.
     */
    cursor?: UserOnboardingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserOnboardings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserOnboardings.
     */
    skip?: number
    distinct?: UserOnboardingScalarFieldEnum | UserOnboardingScalarFieldEnum[]
  }

  /**
   * UserOnboarding create
   */
  export type UserOnboardingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * The data needed to create a UserOnboarding.
     */
    data: XOR<UserOnboardingCreateInput, UserOnboardingUncheckedCreateInput>
  }

  /**
   * UserOnboarding createMany
   */
  export type UserOnboardingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserOnboardings.
     */
    data: UserOnboardingCreateManyInput | UserOnboardingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserOnboarding createManyAndReturn
   */
  export type UserOnboardingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * The data used to create many UserOnboardings.
     */
    data: UserOnboardingCreateManyInput | UserOnboardingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserOnboarding update
   */
  export type UserOnboardingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * The data needed to update a UserOnboarding.
     */
    data: XOR<UserOnboardingUpdateInput, UserOnboardingUncheckedUpdateInput>
    /**
     * Choose, which UserOnboarding to update.
     */
    where: UserOnboardingWhereUniqueInput
  }

  /**
   * UserOnboarding updateMany
   */
  export type UserOnboardingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserOnboardings.
     */
    data: XOR<UserOnboardingUpdateManyMutationInput, UserOnboardingUncheckedUpdateManyInput>
    /**
     * Filter which UserOnboardings to update
     */
    where?: UserOnboardingWhereInput
    /**
     * Limit how many UserOnboardings to update.
     */
    limit?: number
  }

  /**
   * UserOnboarding updateManyAndReturn
   */
  export type UserOnboardingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * The data used to update UserOnboardings.
     */
    data: XOR<UserOnboardingUpdateManyMutationInput, UserOnboardingUncheckedUpdateManyInput>
    /**
     * Filter which UserOnboardings to update
     */
    where?: UserOnboardingWhereInput
    /**
     * Limit how many UserOnboardings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserOnboarding upsert
   */
  export type UserOnboardingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * The filter to search for the UserOnboarding to update in case it exists.
     */
    where: UserOnboardingWhereUniqueInput
    /**
     * In case the UserOnboarding found by the `where` argument doesn't exist, create a new UserOnboarding with this data.
     */
    create: XOR<UserOnboardingCreateInput, UserOnboardingUncheckedCreateInput>
    /**
     * In case the UserOnboarding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserOnboardingUpdateInput, UserOnboardingUncheckedUpdateInput>
  }

  /**
   * UserOnboarding delete
   */
  export type UserOnboardingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
    /**
     * Filter which UserOnboarding to delete.
     */
    where: UserOnboardingWhereUniqueInput
  }

  /**
   * UserOnboarding deleteMany
   */
  export type UserOnboardingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserOnboardings to delete
     */
    where?: UserOnboardingWhereInput
    /**
     * Limit how many UserOnboardings to delete.
     */
    limit?: number
  }

  /**
   * UserOnboarding without action
   */
  export type UserOnboardingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserOnboarding
     */
    select?: UserOnboardingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserOnboarding
     */
    omit?: UserOnboardingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserOnboardingInclude<ExtArgs> | null
  }


  /**
   * Model Gallery
   */

  export type AggregateGallery = {
    _count: GalleryCountAggregateOutputType | null
    _min: GalleryMinAggregateOutputType | null
    _max: GalleryMaxAggregateOutputType | null
  }

  export type GalleryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    slug: string | null
    eventDate: Date | null
    deadline: Date | null
    coverPhotoId: string | null
    passwordHash: string | null
    shareToken: string | null
    isPublished: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GalleryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    slug: string | null
    eventDate: Date | null
    deadline: Date | null
    coverPhotoId: string | null
    passwordHash: string | null
    shareToken: string | null
    isPublished: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GalleryCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    slug: number
    eventDate: number
    deadline: number
    coverPhotoId: number
    passwordHash: number
    shareToken: number
    isPublished: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GalleryMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    slug?: true
    eventDate?: true
    deadline?: true
    coverPhotoId?: true
    passwordHash?: true
    shareToken?: true
    isPublished?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GalleryMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    slug?: true
    eventDate?: true
    deadline?: true
    coverPhotoId?: true
    passwordHash?: true
    shareToken?: true
    isPublished?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GalleryCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    slug?: true
    eventDate?: true
    deadline?: true
    coverPhotoId?: true
    passwordHash?: true
    shareToken?: true
    isPublished?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GalleryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gallery to aggregate.
     */
    where?: GalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Galleries to fetch.
     */
    orderBy?: GalleryOrderByWithRelationInput | GalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Galleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Galleries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Galleries
    **/
    _count?: true | GalleryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GalleryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GalleryMaxAggregateInputType
  }

  export type GetGalleryAggregateType<T extends GalleryAggregateArgs> = {
        [P in keyof T & keyof AggregateGallery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGallery[P]>
      : GetScalarType<T[P], AggregateGallery[P]>
  }




  export type GalleryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryWhereInput
    orderBy?: GalleryOrderByWithAggregationInput | GalleryOrderByWithAggregationInput[]
    by: GalleryScalarFieldEnum[] | GalleryScalarFieldEnum
    having?: GalleryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GalleryCountAggregateInputType | true
    _min?: GalleryMinAggregateInputType
    _max?: GalleryMaxAggregateInputType
  }

  export type GalleryGroupByOutputType = {
    id: string
    userId: string
    title: string
    slug: string
    eventDate: Date | null
    deadline: Date | null
    coverPhotoId: string | null
    passwordHash: string | null
    shareToken: string
    isPublished: boolean
    createdAt: Date
    updatedAt: Date
    _count: GalleryCountAggregateOutputType | null
    _min: GalleryMinAggregateOutputType | null
    _max: GalleryMaxAggregateOutputType | null
  }

  type GetGalleryGroupByPayload<T extends GalleryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GalleryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GalleryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GalleryGroupByOutputType[P]>
            : GetScalarType<T[P], GalleryGroupByOutputType[P]>
        }
      >
    >


  export type GallerySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    eventDate?: boolean
    deadline?: boolean
    coverPhotoId?: boolean
    passwordHash?: boolean
    shareToken?: boolean
    isPublished?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    coverPhoto?: boolean | Gallery$coverPhotoArgs<ExtArgs>
    photos?: boolean | Gallery$photosArgs<ExtArgs>
    albums?: boolean | Gallery$albumsArgs<ExtArgs>
    clients?: boolean | Gallery$clientsArgs<ExtArgs>
    _count?: boolean | GalleryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gallery"]>

  export type GallerySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    eventDate?: boolean
    deadline?: boolean
    coverPhotoId?: boolean
    passwordHash?: boolean
    shareToken?: boolean
    isPublished?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    coverPhoto?: boolean | Gallery$coverPhotoArgs<ExtArgs>
  }, ExtArgs["result"]["gallery"]>

  export type GallerySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    eventDate?: boolean
    deadline?: boolean
    coverPhotoId?: boolean
    passwordHash?: boolean
    shareToken?: boolean
    isPublished?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    coverPhoto?: boolean | Gallery$coverPhotoArgs<ExtArgs>
  }, ExtArgs["result"]["gallery"]>

  export type GallerySelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    eventDate?: boolean
    deadline?: boolean
    coverPhotoId?: boolean
    passwordHash?: boolean
    shareToken?: boolean
    isPublished?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GalleryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "slug" | "eventDate" | "deadline" | "coverPhotoId" | "passwordHash" | "shareToken" | "isPublished" | "createdAt" | "updatedAt", ExtArgs["result"]["gallery"]>
  export type GalleryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    coverPhoto?: boolean | Gallery$coverPhotoArgs<ExtArgs>
    photos?: boolean | Gallery$photosArgs<ExtArgs>
    albums?: boolean | Gallery$albumsArgs<ExtArgs>
    clients?: boolean | Gallery$clientsArgs<ExtArgs>
    _count?: boolean | GalleryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GalleryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    coverPhoto?: boolean | Gallery$coverPhotoArgs<ExtArgs>
  }
  export type GalleryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    coverPhoto?: boolean | Gallery$coverPhotoArgs<ExtArgs>
  }

  export type $GalleryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Gallery"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      coverPhoto: Prisma.$PhotoPayload<ExtArgs> | null
      photos: Prisma.$PhotoPayload<ExtArgs>[]
      albums: Prisma.$AlbumPayload<ExtArgs>[]
      clients: Prisma.$GalleryClientPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      slug: string
      eventDate: Date | null
      deadline: Date | null
      coverPhotoId: string | null
      passwordHash: string | null
      shareToken: string
      isPublished: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["gallery"]>
    composites: {}
  }

  type GalleryGetPayload<S extends boolean | null | undefined | GalleryDefaultArgs> = $Result.GetResult<Prisma.$GalleryPayload, S>

  type GalleryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GalleryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GalleryCountAggregateInputType | true
    }

  export interface GalleryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Gallery'], meta: { name: 'Gallery' } }
    /**
     * Find zero or one Gallery that matches the filter.
     * @param {GalleryFindUniqueArgs} args - Arguments to find a Gallery
     * @example
     * // Get one Gallery
     * const gallery = await prisma.gallery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GalleryFindUniqueArgs>(args: SelectSubset<T, GalleryFindUniqueArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Gallery that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GalleryFindUniqueOrThrowArgs} args - Arguments to find a Gallery
     * @example
     * // Get one Gallery
     * const gallery = await prisma.gallery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GalleryFindUniqueOrThrowArgs>(args: SelectSubset<T, GalleryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gallery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryFindFirstArgs} args - Arguments to find a Gallery
     * @example
     * // Get one Gallery
     * const gallery = await prisma.gallery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GalleryFindFirstArgs>(args?: SelectSubset<T, GalleryFindFirstArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gallery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryFindFirstOrThrowArgs} args - Arguments to find a Gallery
     * @example
     * // Get one Gallery
     * const gallery = await prisma.gallery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GalleryFindFirstOrThrowArgs>(args?: SelectSubset<T, GalleryFindFirstOrThrowArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Galleries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Galleries
     * const galleries = await prisma.gallery.findMany()
     * 
     * // Get first 10 Galleries
     * const galleries = await prisma.gallery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const galleryWithIdOnly = await prisma.gallery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GalleryFindManyArgs>(args?: SelectSubset<T, GalleryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Gallery.
     * @param {GalleryCreateArgs} args - Arguments to create a Gallery.
     * @example
     * // Create one Gallery
     * const Gallery = await prisma.gallery.create({
     *   data: {
     *     // ... data to create a Gallery
     *   }
     * })
     * 
     */
    create<T extends GalleryCreateArgs>(args: SelectSubset<T, GalleryCreateArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Galleries.
     * @param {GalleryCreateManyArgs} args - Arguments to create many Galleries.
     * @example
     * // Create many Galleries
     * const gallery = await prisma.gallery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GalleryCreateManyArgs>(args?: SelectSubset<T, GalleryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Galleries and returns the data saved in the database.
     * @param {GalleryCreateManyAndReturnArgs} args - Arguments to create many Galleries.
     * @example
     * // Create many Galleries
     * const gallery = await prisma.gallery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Galleries and only return the `id`
     * const galleryWithIdOnly = await prisma.gallery.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GalleryCreateManyAndReturnArgs>(args?: SelectSubset<T, GalleryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Gallery.
     * @param {GalleryDeleteArgs} args - Arguments to delete one Gallery.
     * @example
     * // Delete one Gallery
     * const Gallery = await prisma.gallery.delete({
     *   where: {
     *     // ... filter to delete one Gallery
     *   }
     * })
     * 
     */
    delete<T extends GalleryDeleteArgs>(args: SelectSubset<T, GalleryDeleteArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Gallery.
     * @param {GalleryUpdateArgs} args - Arguments to update one Gallery.
     * @example
     * // Update one Gallery
     * const gallery = await prisma.gallery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GalleryUpdateArgs>(args: SelectSubset<T, GalleryUpdateArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Galleries.
     * @param {GalleryDeleteManyArgs} args - Arguments to filter Galleries to delete.
     * @example
     * // Delete a few Galleries
     * const { count } = await prisma.gallery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GalleryDeleteManyArgs>(args?: SelectSubset<T, GalleryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Galleries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Galleries
     * const gallery = await prisma.gallery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GalleryUpdateManyArgs>(args: SelectSubset<T, GalleryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Galleries and returns the data updated in the database.
     * @param {GalleryUpdateManyAndReturnArgs} args - Arguments to update many Galleries.
     * @example
     * // Update many Galleries
     * const gallery = await prisma.gallery.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Galleries and only return the `id`
     * const galleryWithIdOnly = await prisma.gallery.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GalleryUpdateManyAndReturnArgs>(args: SelectSubset<T, GalleryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Gallery.
     * @param {GalleryUpsertArgs} args - Arguments to update or create a Gallery.
     * @example
     * // Update or create a Gallery
     * const gallery = await prisma.gallery.upsert({
     *   create: {
     *     // ... data to create a Gallery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gallery we want to update
     *   }
     * })
     */
    upsert<T extends GalleryUpsertArgs>(args: SelectSubset<T, GalleryUpsertArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Galleries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryCountArgs} args - Arguments to filter Galleries to count.
     * @example
     * // Count the number of Galleries
     * const count = await prisma.gallery.count({
     *   where: {
     *     // ... the filter for the Galleries we want to count
     *   }
     * })
    **/
    count<T extends GalleryCountArgs>(
      args?: Subset<T, GalleryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GalleryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gallery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GalleryAggregateArgs>(args: Subset<T, GalleryAggregateArgs>): Prisma.PrismaPromise<GetGalleryAggregateType<T>>

    /**
     * Group by Gallery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GalleryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GalleryGroupByArgs['orderBy'] }
        : { orderBy?: GalleryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GalleryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGalleryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Gallery model
   */
  readonly fields: GalleryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Gallery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GalleryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    coverPhoto<T extends Gallery$coverPhotoArgs<ExtArgs> = {}>(args?: Subset<T, Gallery$coverPhotoArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    photos<T extends Gallery$photosArgs<ExtArgs> = {}>(args?: Subset<T, Gallery$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    albums<T extends Gallery$albumsArgs<ExtArgs> = {}>(args?: Subset<T, Gallery$albumsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    clients<T extends Gallery$clientsArgs<ExtArgs> = {}>(args?: Subset<T, Gallery$clientsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Gallery model
   */
  interface GalleryFieldRefs {
    readonly id: FieldRef<"Gallery", 'String'>
    readonly userId: FieldRef<"Gallery", 'String'>
    readonly title: FieldRef<"Gallery", 'String'>
    readonly slug: FieldRef<"Gallery", 'String'>
    readonly eventDate: FieldRef<"Gallery", 'DateTime'>
    readonly deadline: FieldRef<"Gallery", 'DateTime'>
    readonly coverPhotoId: FieldRef<"Gallery", 'String'>
    readonly passwordHash: FieldRef<"Gallery", 'String'>
    readonly shareToken: FieldRef<"Gallery", 'String'>
    readonly isPublished: FieldRef<"Gallery", 'Boolean'>
    readonly createdAt: FieldRef<"Gallery", 'DateTime'>
    readonly updatedAt: FieldRef<"Gallery", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Gallery findUnique
   */
  export type GalleryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * Filter, which Gallery to fetch.
     */
    where: GalleryWhereUniqueInput
  }

  /**
   * Gallery findUniqueOrThrow
   */
  export type GalleryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * Filter, which Gallery to fetch.
     */
    where: GalleryWhereUniqueInput
  }

  /**
   * Gallery findFirst
   */
  export type GalleryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * Filter, which Gallery to fetch.
     */
    where?: GalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Galleries to fetch.
     */
    orderBy?: GalleryOrderByWithRelationInput | GalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Galleries.
     */
    cursor?: GalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Galleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Galleries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Galleries.
     */
    distinct?: GalleryScalarFieldEnum | GalleryScalarFieldEnum[]
  }

  /**
   * Gallery findFirstOrThrow
   */
  export type GalleryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * Filter, which Gallery to fetch.
     */
    where?: GalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Galleries to fetch.
     */
    orderBy?: GalleryOrderByWithRelationInput | GalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Galleries.
     */
    cursor?: GalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Galleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Galleries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Galleries.
     */
    distinct?: GalleryScalarFieldEnum | GalleryScalarFieldEnum[]
  }

  /**
   * Gallery findMany
   */
  export type GalleryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * Filter, which Galleries to fetch.
     */
    where?: GalleryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Galleries to fetch.
     */
    orderBy?: GalleryOrderByWithRelationInput | GalleryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Galleries.
     */
    cursor?: GalleryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Galleries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Galleries.
     */
    skip?: number
    distinct?: GalleryScalarFieldEnum | GalleryScalarFieldEnum[]
  }

  /**
   * Gallery create
   */
  export type GalleryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * The data needed to create a Gallery.
     */
    data: XOR<GalleryCreateInput, GalleryUncheckedCreateInput>
  }

  /**
   * Gallery createMany
   */
  export type GalleryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Galleries.
     */
    data: GalleryCreateManyInput | GalleryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Gallery createManyAndReturn
   */
  export type GalleryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * The data used to create many Galleries.
     */
    data: GalleryCreateManyInput | GalleryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gallery update
   */
  export type GalleryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * The data needed to update a Gallery.
     */
    data: XOR<GalleryUpdateInput, GalleryUncheckedUpdateInput>
    /**
     * Choose, which Gallery to update.
     */
    where: GalleryWhereUniqueInput
  }

  /**
   * Gallery updateMany
   */
  export type GalleryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Galleries.
     */
    data: XOR<GalleryUpdateManyMutationInput, GalleryUncheckedUpdateManyInput>
    /**
     * Filter which Galleries to update
     */
    where?: GalleryWhereInput
    /**
     * Limit how many Galleries to update.
     */
    limit?: number
  }

  /**
   * Gallery updateManyAndReturn
   */
  export type GalleryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * The data used to update Galleries.
     */
    data: XOR<GalleryUpdateManyMutationInput, GalleryUncheckedUpdateManyInput>
    /**
     * Filter which Galleries to update
     */
    where?: GalleryWhereInput
    /**
     * Limit how many Galleries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Gallery upsert
   */
  export type GalleryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * The filter to search for the Gallery to update in case it exists.
     */
    where: GalleryWhereUniqueInput
    /**
     * In case the Gallery found by the `where` argument doesn't exist, create a new Gallery with this data.
     */
    create: XOR<GalleryCreateInput, GalleryUncheckedCreateInput>
    /**
     * In case the Gallery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GalleryUpdateInput, GalleryUncheckedUpdateInput>
  }

  /**
   * Gallery delete
   */
  export type GalleryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    /**
     * Filter which Gallery to delete.
     */
    where: GalleryWhereUniqueInput
  }

  /**
   * Gallery deleteMany
   */
  export type GalleryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Galleries to delete
     */
    where?: GalleryWhereInput
    /**
     * Limit how many Galleries to delete.
     */
    limit?: number
  }

  /**
   * Gallery.coverPhoto
   */
  export type Gallery$coverPhotoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    where?: PhotoWhereInput
  }

  /**
   * Gallery.photos
   */
  export type Gallery$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    cursor?: PhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Gallery.albums
   */
  export type Gallery$albumsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    where?: AlbumWhereInput
    orderBy?: AlbumOrderByWithRelationInput | AlbumOrderByWithRelationInput[]
    cursor?: AlbumWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlbumScalarFieldEnum | AlbumScalarFieldEnum[]
  }

  /**
   * Gallery.clients
   */
  export type Gallery$clientsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    where?: GalleryClientWhereInput
    orderBy?: GalleryClientOrderByWithRelationInput | GalleryClientOrderByWithRelationInput[]
    cursor?: GalleryClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GalleryClientScalarFieldEnum | GalleryClientScalarFieldEnum[]
  }

  /**
   * Gallery without action
   */
  export type GalleryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
  }


  /**
   * Model Photo
   */

  export type AggregatePhoto = {
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  export type PhotoAvgAggregateOutputType = {
    originalSize: number | null
    thumbnailSize: number | null
    previewSize: number | null
    totalSize: number | null
    width: number | null
    height: number | null
    order: number | null
    faceCount: number | null
  }

  export type PhotoSumAggregateOutputType = {
    originalSize: bigint | null
    thumbnailSize: bigint | null
    previewSize: bigint | null
    totalSize: bigint | null
    width: number | null
    height: number | null
    order: number | null
    faceCount: number | null
  }

  export type PhotoMinAggregateOutputType = {
    id: string | null
    galleryId: string | null
    s3Key: string | null
    s3Bucket: string | null
    originalFilename: string | null
    originalSize: bigint | null
    thumbnailSize: bigint | null
    previewSize: bigint | null
    totalSize: bigint | null
    width: number | null
    height: number | null
    mimeType: string | null
    order: number | null
    isCulled: boolean | null
    loved: boolean | null
    aiCaption: string | null
    faceCount: number | null
    thumbnailKey: string | null
    previewKey: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PhotoMaxAggregateOutputType = {
    id: string | null
    galleryId: string | null
    s3Key: string | null
    s3Bucket: string | null
    originalFilename: string | null
    originalSize: bigint | null
    thumbnailSize: bigint | null
    previewSize: bigint | null
    totalSize: bigint | null
    width: number | null
    height: number | null
    mimeType: string | null
    order: number | null
    isCulled: boolean | null
    loved: boolean | null
    aiCaption: string | null
    faceCount: number | null
    thumbnailKey: string | null
    previewKey: string | null
    status: string | null
    createdAt: Date | null
  }

  export type PhotoCountAggregateOutputType = {
    id: number
    galleryId: number
    s3Key: number
    s3Bucket: number
    originalFilename: number
    originalSize: number
    thumbnailSize: number
    previewSize: number
    totalSize: number
    width: number
    height: number
    mimeType: number
    order: number
    isCulled: number
    loved: number
    aiCaption: number
    aiTags: number
    faceCount: number
    thumbnailKey: number
    previewKey: number
    status: number
    createdAt: number
    _all: number
  }


  export type PhotoAvgAggregateInputType = {
    originalSize?: true
    thumbnailSize?: true
    previewSize?: true
    totalSize?: true
    width?: true
    height?: true
    order?: true
    faceCount?: true
  }

  export type PhotoSumAggregateInputType = {
    originalSize?: true
    thumbnailSize?: true
    previewSize?: true
    totalSize?: true
    width?: true
    height?: true
    order?: true
    faceCount?: true
  }

  export type PhotoMinAggregateInputType = {
    id?: true
    galleryId?: true
    s3Key?: true
    s3Bucket?: true
    originalFilename?: true
    originalSize?: true
    thumbnailSize?: true
    previewSize?: true
    totalSize?: true
    width?: true
    height?: true
    mimeType?: true
    order?: true
    isCulled?: true
    loved?: true
    aiCaption?: true
    faceCount?: true
    thumbnailKey?: true
    previewKey?: true
    status?: true
    createdAt?: true
  }

  export type PhotoMaxAggregateInputType = {
    id?: true
    galleryId?: true
    s3Key?: true
    s3Bucket?: true
    originalFilename?: true
    originalSize?: true
    thumbnailSize?: true
    previewSize?: true
    totalSize?: true
    width?: true
    height?: true
    mimeType?: true
    order?: true
    isCulled?: true
    loved?: true
    aiCaption?: true
    faceCount?: true
    thumbnailKey?: true
    previewKey?: true
    status?: true
    createdAt?: true
  }

  export type PhotoCountAggregateInputType = {
    id?: true
    galleryId?: true
    s3Key?: true
    s3Bucket?: true
    originalFilename?: true
    originalSize?: true
    thumbnailSize?: true
    previewSize?: true
    totalSize?: true
    width?: true
    height?: true
    mimeType?: true
    order?: true
    isCulled?: true
    loved?: true
    aiCaption?: true
    aiTags?: true
    faceCount?: true
    thumbnailKey?: true
    previewKey?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type PhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photo to aggregate.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Photos
    **/
    _count?: true | PhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhotoMaxAggregateInputType
  }

  export type GetPhotoAggregateType<T extends PhotoAggregateArgs> = {
        [P in keyof T & keyof AggregatePhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhoto[P]>
      : GetScalarType<T[P], AggregatePhoto[P]>
  }




  export type PhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithAggregationInput | PhotoOrderByWithAggregationInput[]
    by: PhotoScalarFieldEnum[] | PhotoScalarFieldEnum
    having?: PhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhotoCountAggregateInputType | true
    _avg?: PhotoAvgAggregateInputType
    _sum?: PhotoSumAggregateInputType
    _min?: PhotoMinAggregateInputType
    _max?: PhotoMaxAggregateInputType
  }

  export type PhotoGroupByOutputType = {
    id: string
    galleryId: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize: bigint
    thumbnailSize: bigint
    previewSize: bigint
    totalSize: bigint
    width: number | null
    height: number | null
    mimeType: string
    order: number
    isCulled: boolean
    loved: boolean
    aiCaption: string | null
    aiTags: string[]
    faceCount: number
    thumbnailKey: string | null
    previewKey: string | null
    status: string
    createdAt: Date
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  type GetPhotoGroupByPayload<T extends PhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhotoGroupByOutputType[P]>
            : GetScalarType<T[P], PhotoGroupByOutputType[P]>
        }
      >
    >


  export type PhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    galleryId?: boolean
    s3Key?: boolean
    s3Bucket?: boolean
    originalFilename?: boolean
    originalSize?: boolean
    thumbnailSize?: boolean
    previewSize?: boolean
    totalSize?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    order?: boolean
    isCulled?: boolean
    loved?: boolean
    aiCaption?: boolean
    aiTags?: boolean
    faceCount?: boolean
    thumbnailKey?: boolean
    previewKey?: boolean
    status?: boolean
    createdAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    usedAsCoverIn?: boolean | Photo$usedAsCoverInArgs<ExtArgs>
    albumPhotos?: boolean | Photo$albumPhotosArgs<ExtArgs>
    _count?: boolean | PhotoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    galleryId?: boolean
    s3Key?: boolean
    s3Bucket?: boolean
    originalFilename?: boolean
    originalSize?: boolean
    thumbnailSize?: boolean
    previewSize?: boolean
    totalSize?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    order?: boolean
    isCulled?: boolean
    loved?: boolean
    aiCaption?: boolean
    aiTags?: boolean
    faceCount?: boolean
    thumbnailKey?: boolean
    previewKey?: boolean
    status?: boolean
    createdAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    galleryId?: boolean
    s3Key?: boolean
    s3Bucket?: boolean
    originalFilename?: boolean
    originalSize?: boolean
    thumbnailSize?: boolean
    previewSize?: boolean
    totalSize?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    order?: boolean
    isCulled?: boolean
    loved?: boolean
    aiCaption?: boolean
    aiTags?: boolean
    faceCount?: boolean
    thumbnailKey?: boolean
    previewKey?: boolean
    status?: boolean
    createdAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectScalar = {
    id?: boolean
    galleryId?: boolean
    s3Key?: boolean
    s3Bucket?: boolean
    originalFilename?: boolean
    originalSize?: boolean
    thumbnailSize?: boolean
    previewSize?: boolean
    totalSize?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    order?: boolean
    isCulled?: boolean
    loved?: boolean
    aiCaption?: boolean
    aiTags?: boolean
    faceCount?: boolean
    thumbnailKey?: boolean
    previewKey?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type PhotoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "galleryId" | "s3Key" | "s3Bucket" | "originalFilename" | "originalSize" | "thumbnailSize" | "previewSize" | "totalSize" | "width" | "height" | "mimeType" | "order" | "isCulled" | "loved" | "aiCaption" | "aiTags" | "faceCount" | "thumbnailKey" | "previewKey" | "status" | "createdAt", ExtArgs["result"]["photo"]>
  export type PhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    usedAsCoverIn?: boolean | Photo$usedAsCoverInArgs<ExtArgs>
    albumPhotos?: boolean | Photo$albumPhotosArgs<ExtArgs>
    _count?: boolean | PhotoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }
  export type PhotoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }

  export type $PhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Photo"
    objects: {
      gallery: Prisma.$GalleryPayload<ExtArgs>
      usedAsCoverIn: Prisma.$GalleryPayload<ExtArgs>[]
      albumPhotos: Prisma.$AlbumPhotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      galleryId: string
      s3Key: string
      s3Bucket: string
      originalFilename: string
      originalSize: bigint
      thumbnailSize: bigint
      previewSize: bigint
      totalSize: bigint
      width: number | null
      height: number | null
      mimeType: string
      order: number
      isCulled: boolean
      loved: boolean
      aiCaption: string | null
      aiTags: string[]
      faceCount: number
      thumbnailKey: string | null
      previewKey: string | null
      status: string
      createdAt: Date
    }, ExtArgs["result"]["photo"]>
    composites: {}
  }

  type PhotoGetPayload<S extends boolean | null | undefined | PhotoDefaultArgs> = $Result.GetResult<Prisma.$PhotoPayload, S>

  type PhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PhotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PhotoCountAggregateInputType | true
    }

  export interface PhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Photo'], meta: { name: 'Photo' } }
    /**
     * Find zero or one Photo that matches the filter.
     * @param {PhotoFindUniqueArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhotoFindUniqueArgs>(args: SelectSubset<T, PhotoFindUniqueArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Photo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhotoFindUniqueOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, PhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Photo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhotoFindFirstArgs>(args?: SelectSubset<T, PhotoFindFirstArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Photo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, PhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Photos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Photos
     * const photos = await prisma.photo.findMany()
     * 
     * // Get first 10 Photos
     * const photos = await prisma.photo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const photoWithIdOnly = await prisma.photo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhotoFindManyArgs>(args?: SelectSubset<T, PhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Photo.
     * @param {PhotoCreateArgs} args - Arguments to create a Photo.
     * @example
     * // Create one Photo
     * const Photo = await prisma.photo.create({
     *   data: {
     *     // ... data to create a Photo
     *   }
     * })
     * 
     */
    create<T extends PhotoCreateArgs>(args: SelectSubset<T, PhotoCreateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Photos.
     * @param {PhotoCreateManyArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhotoCreateManyArgs>(args?: SelectSubset<T, PhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Photos and returns the data saved in the database.
     * @param {PhotoCreateManyAndReturnArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Photos and only return the `id`
     * const photoWithIdOnly = await prisma.photo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, PhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Photo.
     * @param {PhotoDeleteArgs} args - Arguments to delete one Photo.
     * @example
     * // Delete one Photo
     * const Photo = await prisma.photo.delete({
     *   where: {
     *     // ... filter to delete one Photo
     *   }
     * })
     * 
     */
    delete<T extends PhotoDeleteArgs>(args: SelectSubset<T, PhotoDeleteArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Photo.
     * @param {PhotoUpdateArgs} args - Arguments to update one Photo.
     * @example
     * // Update one Photo
     * const photo = await prisma.photo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhotoUpdateArgs>(args: SelectSubset<T, PhotoUpdateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Photos.
     * @param {PhotoDeleteManyArgs} args - Arguments to filter Photos to delete.
     * @example
     * // Delete a few Photos
     * const { count } = await prisma.photo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhotoDeleteManyArgs>(args?: SelectSubset<T, PhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Photos
     * const photo = await prisma.photo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhotoUpdateManyArgs>(args: SelectSubset<T, PhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Photos and returns the data updated in the database.
     * @param {PhotoUpdateManyAndReturnArgs} args - Arguments to update many Photos.
     * @example
     * // Update many Photos
     * const photo = await prisma.photo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Photos and only return the `id`
     * const photoWithIdOnly = await prisma.photo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PhotoUpdateManyAndReturnArgs>(args: SelectSubset<T, PhotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Photo.
     * @param {PhotoUpsertArgs} args - Arguments to update or create a Photo.
     * @example
     * // Update or create a Photo
     * const photo = await prisma.photo.upsert({
     *   create: {
     *     // ... data to create a Photo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Photo we want to update
     *   }
     * })
     */
    upsert<T extends PhotoUpsertArgs>(args: SelectSubset<T, PhotoUpsertArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoCountArgs} args - Arguments to filter Photos to count.
     * @example
     * // Count the number of Photos
     * const count = await prisma.photo.count({
     *   where: {
     *     // ... the filter for the Photos we want to count
     *   }
     * })
    **/
    count<T extends PhotoCountArgs>(
      args?: Subset<T, PhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhotoAggregateArgs>(args: Subset<T, PhotoAggregateArgs>): Prisma.PrismaPromise<GetPhotoAggregateType<T>>

    /**
     * Group by Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhotoGroupByArgs['orderBy'] }
        : { orderBy?: PhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Photo model
   */
  readonly fields: PhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Photo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gallery<T extends GalleryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GalleryDefaultArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    usedAsCoverIn<T extends Photo$usedAsCoverInArgs<ExtArgs> = {}>(args?: Subset<T, Photo$usedAsCoverInArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    albumPhotos<T extends Photo$albumPhotosArgs<ExtArgs> = {}>(args?: Subset<T, Photo$albumPhotosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Photo model
   */
  interface PhotoFieldRefs {
    readonly id: FieldRef<"Photo", 'String'>
    readonly galleryId: FieldRef<"Photo", 'String'>
    readonly s3Key: FieldRef<"Photo", 'String'>
    readonly s3Bucket: FieldRef<"Photo", 'String'>
    readonly originalFilename: FieldRef<"Photo", 'String'>
    readonly originalSize: FieldRef<"Photo", 'BigInt'>
    readonly thumbnailSize: FieldRef<"Photo", 'BigInt'>
    readonly previewSize: FieldRef<"Photo", 'BigInt'>
    readonly totalSize: FieldRef<"Photo", 'BigInt'>
    readonly width: FieldRef<"Photo", 'Int'>
    readonly height: FieldRef<"Photo", 'Int'>
    readonly mimeType: FieldRef<"Photo", 'String'>
    readonly order: FieldRef<"Photo", 'Int'>
    readonly isCulled: FieldRef<"Photo", 'Boolean'>
    readonly loved: FieldRef<"Photo", 'Boolean'>
    readonly aiCaption: FieldRef<"Photo", 'String'>
    readonly aiTags: FieldRef<"Photo", 'String[]'>
    readonly faceCount: FieldRef<"Photo", 'Int'>
    readonly thumbnailKey: FieldRef<"Photo", 'String'>
    readonly previewKey: FieldRef<"Photo", 'String'>
    readonly status: FieldRef<"Photo", 'String'>
    readonly createdAt: FieldRef<"Photo", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Photo findUnique
   */
  export type PhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findUniqueOrThrow
   */
  export type PhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findFirst
   */
  export type PhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findFirstOrThrow
   */
  export type PhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findMany
   */
  export type PhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photos to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo create
   */
  export type PhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a Photo.
     */
    data: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
  }

  /**
   * Photo createMany
   */
  export type PhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Photo createManyAndReturn
   */
  export type PhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Photo update
   */
  export type PhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a Photo.
     */
    data: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
    /**
     * Choose, which Photo to update.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo updateMany
   */
  export type PhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Photos.
     */
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyInput>
    /**
     * Filter which Photos to update
     */
    where?: PhotoWhereInput
    /**
     * Limit how many Photos to update.
     */
    limit?: number
  }

  /**
   * Photo updateManyAndReturn
   */
  export type PhotoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * The data used to update Photos.
     */
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyInput>
    /**
     * Filter which Photos to update
     */
    where?: PhotoWhereInput
    /**
     * Limit how many Photos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Photo upsert
   */
  export type PhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the Photo to update in case it exists.
     */
    where: PhotoWhereUniqueInput
    /**
     * In case the Photo found by the `where` argument doesn't exist, create a new Photo with this data.
     */
    create: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
    /**
     * In case the Photo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
  }

  /**
   * Photo delete
   */
  export type PhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter which Photo to delete.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo deleteMany
   */
  export type PhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photos to delete
     */
    where?: PhotoWhereInput
    /**
     * Limit how many Photos to delete.
     */
    limit?: number
  }

  /**
   * Photo.usedAsCoverIn
   */
  export type Photo$usedAsCoverInArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gallery
     */
    select?: GallerySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gallery
     */
    omit?: GalleryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryInclude<ExtArgs> | null
    where?: GalleryWhereInput
    orderBy?: GalleryOrderByWithRelationInput | GalleryOrderByWithRelationInput[]
    cursor?: GalleryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GalleryScalarFieldEnum | GalleryScalarFieldEnum[]
  }

  /**
   * Photo.albumPhotos
   */
  export type Photo$albumPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    where?: AlbumPhotoWhereInput
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    cursor?: AlbumPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * Photo without action
   */
  export type PhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
  }


  /**
   * Model StorageEvent
   */

  export type AggregateStorageEvent = {
    _count: StorageEventCountAggregateOutputType | null
    _avg: StorageEventAvgAggregateOutputType | null
    _sum: StorageEventSumAggregateOutputType | null
    _min: StorageEventMinAggregateOutputType | null
    _max: StorageEventMaxAggregateOutputType | null
  }

  export type StorageEventAvgAggregateOutputType = {
    delta: number | null
  }

  export type StorageEventSumAggregateOutputType = {
    delta: bigint | null
  }

  export type StorageEventMinAggregateOutputType = {
    id: string | null
    userId: string | null
    photoId: string | null
    delta: bigint | null
    reason: string | null
    createdAt: Date | null
  }

  export type StorageEventMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    photoId: string | null
    delta: bigint | null
    reason: string | null
    createdAt: Date | null
  }

  export type StorageEventCountAggregateOutputType = {
    id: number
    userId: number
    photoId: number
    delta: number
    reason: number
    createdAt: number
    _all: number
  }


  export type StorageEventAvgAggregateInputType = {
    delta?: true
  }

  export type StorageEventSumAggregateInputType = {
    delta?: true
  }

  export type StorageEventMinAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
    delta?: true
    reason?: true
    createdAt?: true
  }

  export type StorageEventMaxAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
    delta?: true
    reason?: true
    createdAt?: true
  }

  export type StorageEventCountAggregateInputType = {
    id?: true
    userId?: true
    photoId?: true
    delta?: true
    reason?: true
    createdAt?: true
    _all?: true
  }

  export type StorageEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageEvent to aggregate.
     */
    where?: StorageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageEvents to fetch.
     */
    orderBy?: StorageEventOrderByWithRelationInput | StorageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StorageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StorageEvents
    **/
    _count?: true | StorageEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StorageEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StorageEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StorageEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StorageEventMaxAggregateInputType
  }

  export type GetStorageEventAggregateType<T extends StorageEventAggregateArgs> = {
        [P in keyof T & keyof AggregateStorageEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStorageEvent[P]>
      : GetScalarType<T[P], AggregateStorageEvent[P]>
  }




  export type StorageEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StorageEventWhereInput
    orderBy?: StorageEventOrderByWithAggregationInput | StorageEventOrderByWithAggregationInput[]
    by: StorageEventScalarFieldEnum[] | StorageEventScalarFieldEnum
    having?: StorageEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StorageEventCountAggregateInputType | true
    _avg?: StorageEventAvgAggregateInputType
    _sum?: StorageEventSumAggregateInputType
    _min?: StorageEventMinAggregateInputType
    _max?: StorageEventMaxAggregateInputType
  }

  export type StorageEventGroupByOutputType = {
    id: string
    userId: string
    photoId: string | null
    delta: bigint
    reason: string
    createdAt: Date
    _count: StorageEventCountAggregateOutputType | null
    _avg: StorageEventAvgAggregateOutputType | null
    _sum: StorageEventSumAggregateOutputType | null
    _min: StorageEventMinAggregateOutputType | null
    _max: StorageEventMaxAggregateOutputType | null
  }

  type GetStorageEventGroupByPayload<T extends StorageEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StorageEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StorageEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StorageEventGroupByOutputType[P]>
            : GetScalarType<T[P], StorageEventGroupByOutputType[P]>
        }
      >
    >


  export type StorageEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    photoId?: boolean
    delta?: boolean
    reason?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageEvent"]>

  export type StorageEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    photoId?: boolean
    delta?: boolean
    reason?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageEvent"]>

  export type StorageEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    photoId?: boolean
    delta?: boolean
    reason?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageEvent"]>

  export type StorageEventSelectScalar = {
    id?: boolean
    userId?: boolean
    photoId?: boolean
    delta?: boolean
    reason?: boolean
    createdAt?: boolean
  }

  export type StorageEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "photoId" | "delta" | "reason" | "createdAt", ExtArgs["result"]["storageEvent"]>
  export type StorageEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StorageEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type StorageEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $StorageEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StorageEvent"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      photoId: string | null
      delta: bigint
      reason: string
      createdAt: Date
    }, ExtArgs["result"]["storageEvent"]>
    composites: {}
  }

  type StorageEventGetPayload<S extends boolean | null | undefined | StorageEventDefaultArgs> = $Result.GetResult<Prisma.$StorageEventPayload, S>

  type StorageEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StorageEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StorageEventCountAggregateInputType | true
    }

  export interface StorageEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StorageEvent'], meta: { name: 'StorageEvent' } }
    /**
     * Find zero or one StorageEvent that matches the filter.
     * @param {StorageEventFindUniqueArgs} args - Arguments to find a StorageEvent
     * @example
     * // Get one StorageEvent
     * const storageEvent = await prisma.storageEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StorageEventFindUniqueArgs>(args: SelectSubset<T, StorageEventFindUniqueArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StorageEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StorageEventFindUniqueOrThrowArgs} args - Arguments to find a StorageEvent
     * @example
     * // Get one StorageEvent
     * const storageEvent = await prisma.storageEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StorageEventFindUniqueOrThrowArgs>(args: SelectSubset<T, StorageEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StorageEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageEventFindFirstArgs} args - Arguments to find a StorageEvent
     * @example
     * // Get one StorageEvent
     * const storageEvent = await prisma.storageEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StorageEventFindFirstArgs>(args?: SelectSubset<T, StorageEventFindFirstArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StorageEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageEventFindFirstOrThrowArgs} args - Arguments to find a StorageEvent
     * @example
     * // Get one StorageEvent
     * const storageEvent = await prisma.storageEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StorageEventFindFirstOrThrowArgs>(args?: SelectSubset<T, StorageEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StorageEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StorageEvents
     * const storageEvents = await prisma.storageEvent.findMany()
     * 
     * // Get first 10 StorageEvents
     * const storageEvents = await prisma.storageEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storageEventWithIdOnly = await prisma.storageEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StorageEventFindManyArgs>(args?: SelectSubset<T, StorageEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StorageEvent.
     * @param {StorageEventCreateArgs} args - Arguments to create a StorageEvent.
     * @example
     * // Create one StorageEvent
     * const StorageEvent = await prisma.storageEvent.create({
     *   data: {
     *     // ... data to create a StorageEvent
     *   }
     * })
     * 
     */
    create<T extends StorageEventCreateArgs>(args: SelectSubset<T, StorageEventCreateArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StorageEvents.
     * @param {StorageEventCreateManyArgs} args - Arguments to create many StorageEvents.
     * @example
     * // Create many StorageEvents
     * const storageEvent = await prisma.storageEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StorageEventCreateManyArgs>(args?: SelectSubset<T, StorageEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StorageEvents and returns the data saved in the database.
     * @param {StorageEventCreateManyAndReturnArgs} args - Arguments to create many StorageEvents.
     * @example
     * // Create many StorageEvents
     * const storageEvent = await prisma.storageEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StorageEvents and only return the `id`
     * const storageEventWithIdOnly = await prisma.storageEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StorageEventCreateManyAndReturnArgs>(args?: SelectSubset<T, StorageEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StorageEvent.
     * @param {StorageEventDeleteArgs} args - Arguments to delete one StorageEvent.
     * @example
     * // Delete one StorageEvent
     * const StorageEvent = await prisma.storageEvent.delete({
     *   where: {
     *     // ... filter to delete one StorageEvent
     *   }
     * })
     * 
     */
    delete<T extends StorageEventDeleteArgs>(args: SelectSubset<T, StorageEventDeleteArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StorageEvent.
     * @param {StorageEventUpdateArgs} args - Arguments to update one StorageEvent.
     * @example
     * // Update one StorageEvent
     * const storageEvent = await prisma.storageEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StorageEventUpdateArgs>(args: SelectSubset<T, StorageEventUpdateArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StorageEvents.
     * @param {StorageEventDeleteManyArgs} args - Arguments to filter StorageEvents to delete.
     * @example
     * // Delete a few StorageEvents
     * const { count } = await prisma.storageEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StorageEventDeleteManyArgs>(args?: SelectSubset<T, StorageEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StorageEvents
     * const storageEvent = await prisma.storageEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StorageEventUpdateManyArgs>(args: SelectSubset<T, StorageEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageEvents and returns the data updated in the database.
     * @param {StorageEventUpdateManyAndReturnArgs} args - Arguments to update many StorageEvents.
     * @example
     * // Update many StorageEvents
     * const storageEvent = await prisma.storageEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StorageEvents and only return the `id`
     * const storageEventWithIdOnly = await prisma.storageEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StorageEventUpdateManyAndReturnArgs>(args: SelectSubset<T, StorageEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StorageEvent.
     * @param {StorageEventUpsertArgs} args - Arguments to update or create a StorageEvent.
     * @example
     * // Update or create a StorageEvent
     * const storageEvent = await prisma.storageEvent.upsert({
     *   create: {
     *     // ... data to create a StorageEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StorageEvent we want to update
     *   }
     * })
     */
    upsert<T extends StorageEventUpsertArgs>(args: SelectSubset<T, StorageEventUpsertArgs<ExtArgs>>): Prisma__StorageEventClient<$Result.GetResult<Prisma.$StorageEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StorageEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageEventCountArgs} args - Arguments to filter StorageEvents to count.
     * @example
     * // Count the number of StorageEvents
     * const count = await prisma.storageEvent.count({
     *   where: {
     *     // ... the filter for the StorageEvents we want to count
     *   }
     * })
    **/
    count<T extends StorageEventCountArgs>(
      args?: Subset<T, StorageEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StorageEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StorageEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StorageEventAggregateArgs>(args: Subset<T, StorageEventAggregateArgs>): Prisma.PrismaPromise<GetStorageEventAggregateType<T>>

    /**
     * Group by StorageEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StorageEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StorageEventGroupByArgs['orderBy'] }
        : { orderBy?: StorageEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StorageEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStorageEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StorageEvent model
   */
  readonly fields: StorageEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StorageEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StorageEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StorageEvent model
   */
  interface StorageEventFieldRefs {
    readonly id: FieldRef<"StorageEvent", 'String'>
    readonly userId: FieldRef<"StorageEvent", 'String'>
    readonly photoId: FieldRef<"StorageEvent", 'String'>
    readonly delta: FieldRef<"StorageEvent", 'BigInt'>
    readonly reason: FieldRef<"StorageEvent", 'String'>
    readonly createdAt: FieldRef<"StorageEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StorageEvent findUnique
   */
  export type StorageEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * Filter, which StorageEvent to fetch.
     */
    where: StorageEventWhereUniqueInput
  }

  /**
   * StorageEvent findUniqueOrThrow
   */
  export type StorageEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * Filter, which StorageEvent to fetch.
     */
    where: StorageEventWhereUniqueInput
  }

  /**
   * StorageEvent findFirst
   */
  export type StorageEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * Filter, which StorageEvent to fetch.
     */
    where?: StorageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageEvents to fetch.
     */
    orderBy?: StorageEventOrderByWithRelationInput | StorageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageEvents.
     */
    cursor?: StorageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageEvents.
     */
    distinct?: StorageEventScalarFieldEnum | StorageEventScalarFieldEnum[]
  }

  /**
   * StorageEvent findFirstOrThrow
   */
  export type StorageEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * Filter, which StorageEvent to fetch.
     */
    where?: StorageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageEvents to fetch.
     */
    orderBy?: StorageEventOrderByWithRelationInput | StorageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageEvents.
     */
    cursor?: StorageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageEvents.
     */
    distinct?: StorageEventScalarFieldEnum | StorageEventScalarFieldEnum[]
  }

  /**
   * StorageEvent findMany
   */
  export type StorageEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * Filter, which StorageEvents to fetch.
     */
    where?: StorageEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageEvents to fetch.
     */
    orderBy?: StorageEventOrderByWithRelationInput | StorageEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StorageEvents.
     */
    cursor?: StorageEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageEvents.
     */
    skip?: number
    distinct?: StorageEventScalarFieldEnum | StorageEventScalarFieldEnum[]
  }

  /**
   * StorageEvent create
   */
  export type StorageEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * The data needed to create a StorageEvent.
     */
    data: XOR<StorageEventCreateInput, StorageEventUncheckedCreateInput>
  }

  /**
   * StorageEvent createMany
   */
  export type StorageEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StorageEvents.
     */
    data: StorageEventCreateManyInput | StorageEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StorageEvent createManyAndReturn
   */
  export type StorageEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * The data used to create many StorageEvents.
     */
    data: StorageEventCreateManyInput | StorageEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StorageEvent update
   */
  export type StorageEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * The data needed to update a StorageEvent.
     */
    data: XOR<StorageEventUpdateInput, StorageEventUncheckedUpdateInput>
    /**
     * Choose, which StorageEvent to update.
     */
    where: StorageEventWhereUniqueInput
  }

  /**
   * StorageEvent updateMany
   */
  export type StorageEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StorageEvents.
     */
    data: XOR<StorageEventUpdateManyMutationInput, StorageEventUncheckedUpdateManyInput>
    /**
     * Filter which StorageEvents to update
     */
    where?: StorageEventWhereInput
    /**
     * Limit how many StorageEvents to update.
     */
    limit?: number
  }

  /**
   * StorageEvent updateManyAndReturn
   */
  export type StorageEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * The data used to update StorageEvents.
     */
    data: XOR<StorageEventUpdateManyMutationInput, StorageEventUncheckedUpdateManyInput>
    /**
     * Filter which StorageEvents to update
     */
    where?: StorageEventWhereInput
    /**
     * Limit how many StorageEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StorageEvent upsert
   */
  export type StorageEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * The filter to search for the StorageEvent to update in case it exists.
     */
    where: StorageEventWhereUniqueInput
    /**
     * In case the StorageEvent found by the `where` argument doesn't exist, create a new StorageEvent with this data.
     */
    create: XOR<StorageEventCreateInput, StorageEventUncheckedCreateInput>
    /**
     * In case the StorageEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StorageEventUpdateInput, StorageEventUncheckedUpdateInput>
  }

  /**
   * StorageEvent delete
   */
  export type StorageEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
    /**
     * Filter which StorageEvent to delete.
     */
    where: StorageEventWhereUniqueInput
  }

  /**
   * StorageEvent deleteMany
   */
  export type StorageEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageEvents to delete
     */
    where?: StorageEventWhereInput
    /**
     * Limit how many StorageEvents to delete.
     */
    limit?: number
  }

  /**
   * StorageEvent without action
   */
  export type StorageEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageEvent
     */
    select?: StorageEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageEvent
     */
    omit?: StorageEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageEventInclude<ExtArgs> | null
  }


  /**
   * Model Client
   */

  export type AggregateClient = {
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  export type ClientMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ClientCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    email: number
    phone: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ClientMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ClientCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    phone?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Client to aggregate.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Clients
    **/
    _count?: true | ClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ClientMaxAggregateInputType
  }

  export type GetClientAggregateType<T extends ClientAggregateArgs> = {
        [P in keyof T & keyof AggregateClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateClient[P]>
      : GetScalarType<T[P], AggregateClient[P]>
  }




  export type ClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ClientWhereInput
    orderBy?: ClientOrderByWithAggregationInput | ClientOrderByWithAggregationInput[]
    by: ClientScalarFieldEnum[] | ClientScalarFieldEnum
    having?: ClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ClientCountAggregateInputType | true
    _min?: ClientMinAggregateInputType
    _max?: ClientMaxAggregateInputType
  }

  export type ClientGroupByOutputType = {
    id: string
    userId: string
    name: string
    email: string
    phone: string | null
    createdAt: Date
    updatedAt: Date
    _count: ClientCountAggregateOutputType | null
    _min: ClientMinAggregateOutputType | null
    _max: ClientMaxAggregateOutputType | null
  }

  type GetClientGroupByPayload<T extends ClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ClientGroupByOutputType[P]>
            : GetScalarType<T[P], ClientGroupByOutputType[P]>
        }
      >
    >


  export type ClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    galleries?: boolean | Client$galleriesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["client"]>

  export type ClientSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "email" | "phone" | "createdAt" | "updatedAt", ExtArgs["result"]["client"]>
  export type ClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    galleries?: boolean | Client$galleriesArgs<ExtArgs>
    _count?: boolean | ClientCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ClientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Client"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      galleries: Prisma.$GalleryClientPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      email: string
      phone: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["client"]>
    composites: {}
  }

  type ClientGetPayload<S extends boolean | null | undefined | ClientDefaultArgs> = $Result.GetResult<Prisma.$ClientPayload, S>

  type ClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ClientCountAggregateInputType | true
    }

  export interface ClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Client'], meta: { name: 'Client' } }
    /**
     * Find zero or one Client that matches the filter.
     * @param {ClientFindUniqueArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ClientFindUniqueArgs>(args: SelectSubset<T, ClientFindUniqueArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Client that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ClientFindUniqueOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ClientFindUniqueOrThrowArgs>(args: SelectSubset<T, ClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ClientFindFirstArgs>(args?: SelectSubset<T, ClientFindFirstArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Client that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindFirstOrThrowArgs} args - Arguments to find a Client
     * @example
     * // Get one Client
     * const client = await prisma.client.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ClientFindFirstOrThrowArgs>(args?: SelectSubset<T, ClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Clients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Clients
     * const clients = await prisma.client.findMany()
     * 
     * // Get first 10 Clients
     * const clients = await prisma.client.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const clientWithIdOnly = await prisma.client.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ClientFindManyArgs>(args?: SelectSubset<T, ClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Client.
     * @param {ClientCreateArgs} args - Arguments to create a Client.
     * @example
     * // Create one Client
     * const Client = await prisma.client.create({
     *   data: {
     *     // ... data to create a Client
     *   }
     * })
     * 
     */
    create<T extends ClientCreateArgs>(args: SelectSubset<T, ClientCreateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Clients.
     * @param {ClientCreateManyArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ClientCreateManyArgs>(args?: SelectSubset<T, ClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Clients and returns the data saved in the database.
     * @param {ClientCreateManyAndReturnArgs} args - Arguments to create many Clients.
     * @example
     * // Create many Clients
     * const client = await prisma.client.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ClientCreateManyAndReturnArgs>(args?: SelectSubset<T, ClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Client.
     * @param {ClientDeleteArgs} args - Arguments to delete one Client.
     * @example
     * // Delete one Client
     * const Client = await prisma.client.delete({
     *   where: {
     *     // ... filter to delete one Client
     *   }
     * })
     * 
     */
    delete<T extends ClientDeleteArgs>(args: SelectSubset<T, ClientDeleteArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Client.
     * @param {ClientUpdateArgs} args - Arguments to update one Client.
     * @example
     * // Update one Client
     * const client = await prisma.client.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ClientUpdateArgs>(args: SelectSubset<T, ClientUpdateArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Clients.
     * @param {ClientDeleteManyArgs} args - Arguments to filter Clients to delete.
     * @example
     * // Delete a few Clients
     * const { count } = await prisma.client.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ClientDeleteManyArgs>(args?: SelectSubset<T, ClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ClientUpdateManyArgs>(args: SelectSubset<T, ClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Clients and returns the data updated in the database.
     * @param {ClientUpdateManyAndReturnArgs} args - Arguments to update many Clients.
     * @example
     * // Update many Clients
     * const client = await prisma.client.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Clients and only return the `id`
     * const clientWithIdOnly = await prisma.client.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ClientUpdateManyAndReturnArgs>(args: SelectSubset<T, ClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Client.
     * @param {ClientUpsertArgs} args - Arguments to update or create a Client.
     * @example
     * // Update or create a Client
     * const client = await prisma.client.upsert({
     *   create: {
     *     // ... data to create a Client
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Client we want to update
     *   }
     * })
     */
    upsert<T extends ClientUpsertArgs>(args: SelectSubset<T, ClientUpsertArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Clients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientCountArgs} args - Arguments to filter Clients to count.
     * @example
     * // Count the number of Clients
     * const count = await prisma.client.count({
     *   where: {
     *     // ... the filter for the Clients we want to count
     *   }
     * })
    **/
    count<T extends ClientCountArgs>(
      args?: Subset<T, ClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ClientAggregateArgs>(args: Subset<T, ClientAggregateArgs>): Prisma.PrismaPromise<GetClientAggregateType<T>>

    /**
     * Group by Client.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ClientGroupByArgs['orderBy'] }
        : { orderBy?: ClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Client model
   */
  readonly fields: ClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Client.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    galleries<T extends Client$galleriesArgs<ExtArgs> = {}>(args?: Subset<T, Client$galleriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Client model
   */
  interface ClientFieldRefs {
    readonly id: FieldRef<"Client", 'String'>
    readonly userId: FieldRef<"Client", 'String'>
    readonly name: FieldRef<"Client", 'String'>
    readonly email: FieldRef<"Client", 'String'>
    readonly phone: FieldRef<"Client", 'String'>
    readonly createdAt: FieldRef<"Client", 'DateTime'>
    readonly updatedAt: FieldRef<"Client", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Client findUnique
   */
  export type ClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findUniqueOrThrow
   */
  export type ClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client findFirst
   */
  export type ClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findFirstOrThrow
   */
  export type ClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Client to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Clients.
     */
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client findMany
   */
  export type ClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter, which Clients to fetch.
     */
    where?: ClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Clients to fetch.
     */
    orderBy?: ClientOrderByWithRelationInput | ClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Clients.
     */
    cursor?: ClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Clients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Clients.
     */
    skip?: number
    distinct?: ClientScalarFieldEnum | ClientScalarFieldEnum[]
  }

  /**
   * Client create
   */
  export type ClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to create a Client.
     */
    data: XOR<ClientCreateInput, ClientUncheckedCreateInput>
  }

  /**
   * Client createMany
   */
  export type ClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Client createManyAndReturn
   */
  export type ClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to create many Clients.
     */
    data: ClientCreateManyInput | ClientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client update
   */
  export type ClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The data needed to update a Client.
     */
    data: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
    /**
     * Choose, which Client to update.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client updateMany
   */
  export type ClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
  }

  /**
   * Client updateManyAndReturn
   */
  export type ClientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * The data used to update Clients.
     */
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyInput>
    /**
     * Filter which Clients to update
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Client upsert
   */
  export type ClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * The filter to search for the Client to update in case it exists.
     */
    where: ClientWhereUniqueInput
    /**
     * In case the Client found by the `where` argument doesn't exist, create a new Client with this data.
     */
    create: XOR<ClientCreateInput, ClientUncheckedCreateInput>
    /**
     * In case the Client was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ClientUpdateInput, ClientUncheckedUpdateInput>
  }

  /**
   * Client delete
   */
  export type ClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
    /**
     * Filter which Client to delete.
     */
    where: ClientWhereUniqueInput
  }

  /**
   * Client deleteMany
   */
  export type ClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Clients to delete
     */
    where?: ClientWhereInput
    /**
     * Limit how many Clients to delete.
     */
    limit?: number
  }

  /**
   * Client.galleries
   */
  export type Client$galleriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    where?: GalleryClientWhereInput
    orderBy?: GalleryClientOrderByWithRelationInput | GalleryClientOrderByWithRelationInput[]
    cursor?: GalleryClientWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GalleryClientScalarFieldEnum | GalleryClientScalarFieldEnum[]
  }

  /**
   * Client without action
   */
  export type ClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Client
     */
    select?: ClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Client
     */
    omit?: ClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ClientInclude<ExtArgs> | null
  }


  /**
   * Model GalleryClient
   */

  export type AggregateGalleryClient = {
    _count: GalleryClientCountAggregateOutputType | null
    _min: GalleryClientMinAggregateOutputType | null
    _max: GalleryClientMaxAggregateOutputType | null
  }

  export type GalleryClientMinAggregateOutputType = {
    galleryId: string | null
    clientId: string | null
    createdAt: Date | null
  }

  export type GalleryClientMaxAggregateOutputType = {
    galleryId: string | null
    clientId: string | null
    createdAt: Date | null
  }

  export type GalleryClientCountAggregateOutputType = {
    galleryId: number
    clientId: number
    createdAt: number
    _all: number
  }


  export type GalleryClientMinAggregateInputType = {
    galleryId?: true
    clientId?: true
    createdAt?: true
  }

  export type GalleryClientMaxAggregateInputType = {
    galleryId?: true
    clientId?: true
    createdAt?: true
  }

  export type GalleryClientCountAggregateInputType = {
    galleryId?: true
    clientId?: true
    createdAt?: true
    _all?: true
  }

  export type GalleryClientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GalleryClient to aggregate.
     */
    where?: GalleryClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryClients to fetch.
     */
    orderBy?: GalleryClientOrderByWithRelationInput | GalleryClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GalleryClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryClients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryClients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GalleryClients
    **/
    _count?: true | GalleryClientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GalleryClientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GalleryClientMaxAggregateInputType
  }

  export type GetGalleryClientAggregateType<T extends GalleryClientAggregateArgs> = {
        [P in keyof T & keyof AggregateGalleryClient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGalleryClient[P]>
      : GetScalarType<T[P], AggregateGalleryClient[P]>
  }




  export type GalleryClientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GalleryClientWhereInput
    orderBy?: GalleryClientOrderByWithAggregationInput | GalleryClientOrderByWithAggregationInput[]
    by: GalleryClientScalarFieldEnum[] | GalleryClientScalarFieldEnum
    having?: GalleryClientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GalleryClientCountAggregateInputType | true
    _min?: GalleryClientMinAggregateInputType
    _max?: GalleryClientMaxAggregateInputType
  }

  export type GalleryClientGroupByOutputType = {
    galleryId: string
    clientId: string
    createdAt: Date
    _count: GalleryClientCountAggregateOutputType | null
    _min: GalleryClientMinAggregateOutputType | null
    _max: GalleryClientMaxAggregateOutputType | null
  }

  type GetGalleryClientGroupByPayload<T extends GalleryClientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GalleryClientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GalleryClientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GalleryClientGroupByOutputType[P]>
            : GetScalarType<T[P], GalleryClientGroupByOutputType[P]>
        }
      >
    >


  export type GalleryClientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    galleryId?: boolean
    clientId?: boolean
    createdAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["galleryClient"]>

  export type GalleryClientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    galleryId?: boolean
    clientId?: boolean
    createdAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["galleryClient"]>

  export type GalleryClientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    galleryId?: boolean
    clientId?: boolean
    createdAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["galleryClient"]>

  export type GalleryClientSelectScalar = {
    galleryId?: boolean
    clientId?: boolean
    createdAt?: boolean
  }

  export type GalleryClientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"galleryId" | "clientId" | "createdAt", ExtArgs["result"]["galleryClient"]>
  export type GalleryClientInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type GalleryClientIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }
  export type GalleryClientIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    client?: boolean | ClientDefaultArgs<ExtArgs>
  }

  export type $GalleryClientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GalleryClient"
    objects: {
      gallery: Prisma.$GalleryPayload<ExtArgs>
      client: Prisma.$ClientPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      galleryId: string
      clientId: string
      createdAt: Date
    }, ExtArgs["result"]["galleryClient"]>
    composites: {}
  }

  type GalleryClientGetPayload<S extends boolean | null | undefined | GalleryClientDefaultArgs> = $Result.GetResult<Prisma.$GalleryClientPayload, S>

  type GalleryClientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GalleryClientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GalleryClientCountAggregateInputType | true
    }

  export interface GalleryClientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GalleryClient'], meta: { name: 'GalleryClient' } }
    /**
     * Find zero or one GalleryClient that matches the filter.
     * @param {GalleryClientFindUniqueArgs} args - Arguments to find a GalleryClient
     * @example
     * // Get one GalleryClient
     * const galleryClient = await prisma.galleryClient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GalleryClientFindUniqueArgs>(args: SelectSubset<T, GalleryClientFindUniqueArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GalleryClient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GalleryClientFindUniqueOrThrowArgs} args - Arguments to find a GalleryClient
     * @example
     * // Get one GalleryClient
     * const galleryClient = await prisma.galleryClient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GalleryClientFindUniqueOrThrowArgs>(args: SelectSubset<T, GalleryClientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GalleryClient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryClientFindFirstArgs} args - Arguments to find a GalleryClient
     * @example
     * // Get one GalleryClient
     * const galleryClient = await prisma.galleryClient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GalleryClientFindFirstArgs>(args?: SelectSubset<T, GalleryClientFindFirstArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GalleryClient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryClientFindFirstOrThrowArgs} args - Arguments to find a GalleryClient
     * @example
     * // Get one GalleryClient
     * const galleryClient = await prisma.galleryClient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GalleryClientFindFirstOrThrowArgs>(args?: SelectSubset<T, GalleryClientFindFirstOrThrowArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GalleryClients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryClientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GalleryClients
     * const galleryClients = await prisma.galleryClient.findMany()
     * 
     * // Get first 10 GalleryClients
     * const galleryClients = await prisma.galleryClient.findMany({ take: 10 })
     * 
     * // Only select the `galleryId`
     * const galleryClientWithGalleryIdOnly = await prisma.galleryClient.findMany({ select: { galleryId: true } })
     * 
     */
    findMany<T extends GalleryClientFindManyArgs>(args?: SelectSubset<T, GalleryClientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GalleryClient.
     * @param {GalleryClientCreateArgs} args - Arguments to create a GalleryClient.
     * @example
     * // Create one GalleryClient
     * const GalleryClient = await prisma.galleryClient.create({
     *   data: {
     *     // ... data to create a GalleryClient
     *   }
     * })
     * 
     */
    create<T extends GalleryClientCreateArgs>(args: SelectSubset<T, GalleryClientCreateArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GalleryClients.
     * @param {GalleryClientCreateManyArgs} args - Arguments to create many GalleryClients.
     * @example
     * // Create many GalleryClients
     * const galleryClient = await prisma.galleryClient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GalleryClientCreateManyArgs>(args?: SelectSubset<T, GalleryClientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GalleryClients and returns the data saved in the database.
     * @param {GalleryClientCreateManyAndReturnArgs} args - Arguments to create many GalleryClients.
     * @example
     * // Create many GalleryClients
     * const galleryClient = await prisma.galleryClient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GalleryClients and only return the `galleryId`
     * const galleryClientWithGalleryIdOnly = await prisma.galleryClient.createManyAndReturn({
     *   select: { galleryId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GalleryClientCreateManyAndReturnArgs>(args?: SelectSubset<T, GalleryClientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GalleryClient.
     * @param {GalleryClientDeleteArgs} args - Arguments to delete one GalleryClient.
     * @example
     * // Delete one GalleryClient
     * const GalleryClient = await prisma.galleryClient.delete({
     *   where: {
     *     // ... filter to delete one GalleryClient
     *   }
     * })
     * 
     */
    delete<T extends GalleryClientDeleteArgs>(args: SelectSubset<T, GalleryClientDeleteArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GalleryClient.
     * @param {GalleryClientUpdateArgs} args - Arguments to update one GalleryClient.
     * @example
     * // Update one GalleryClient
     * const galleryClient = await prisma.galleryClient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GalleryClientUpdateArgs>(args: SelectSubset<T, GalleryClientUpdateArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GalleryClients.
     * @param {GalleryClientDeleteManyArgs} args - Arguments to filter GalleryClients to delete.
     * @example
     * // Delete a few GalleryClients
     * const { count } = await prisma.galleryClient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GalleryClientDeleteManyArgs>(args?: SelectSubset<T, GalleryClientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GalleryClients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryClientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GalleryClients
     * const galleryClient = await prisma.galleryClient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GalleryClientUpdateManyArgs>(args: SelectSubset<T, GalleryClientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GalleryClients and returns the data updated in the database.
     * @param {GalleryClientUpdateManyAndReturnArgs} args - Arguments to update many GalleryClients.
     * @example
     * // Update many GalleryClients
     * const galleryClient = await prisma.galleryClient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GalleryClients and only return the `galleryId`
     * const galleryClientWithGalleryIdOnly = await prisma.galleryClient.updateManyAndReturn({
     *   select: { galleryId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GalleryClientUpdateManyAndReturnArgs>(args: SelectSubset<T, GalleryClientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GalleryClient.
     * @param {GalleryClientUpsertArgs} args - Arguments to update or create a GalleryClient.
     * @example
     * // Update or create a GalleryClient
     * const galleryClient = await prisma.galleryClient.upsert({
     *   create: {
     *     // ... data to create a GalleryClient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GalleryClient we want to update
     *   }
     * })
     */
    upsert<T extends GalleryClientUpsertArgs>(args: SelectSubset<T, GalleryClientUpsertArgs<ExtArgs>>): Prisma__GalleryClientClient<$Result.GetResult<Prisma.$GalleryClientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GalleryClients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryClientCountArgs} args - Arguments to filter GalleryClients to count.
     * @example
     * // Count the number of GalleryClients
     * const count = await prisma.galleryClient.count({
     *   where: {
     *     // ... the filter for the GalleryClients we want to count
     *   }
     * })
    **/
    count<T extends GalleryClientCountArgs>(
      args?: Subset<T, GalleryClientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GalleryClientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GalleryClient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryClientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GalleryClientAggregateArgs>(args: Subset<T, GalleryClientAggregateArgs>): Prisma.PrismaPromise<GetGalleryClientAggregateType<T>>

    /**
     * Group by GalleryClient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GalleryClientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GalleryClientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GalleryClientGroupByArgs['orderBy'] }
        : { orderBy?: GalleryClientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GalleryClientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGalleryClientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GalleryClient model
   */
  readonly fields: GalleryClientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GalleryClient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GalleryClientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gallery<T extends GalleryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GalleryDefaultArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    client<T extends ClientDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ClientDefaultArgs<ExtArgs>>): Prisma__ClientClient<$Result.GetResult<Prisma.$ClientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GalleryClient model
   */
  interface GalleryClientFieldRefs {
    readonly galleryId: FieldRef<"GalleryClient", 'String'>
    readonly clientId: FieldRef<"GalleryClient", 'String'>
    readonly createdAt: FieldRef<"GalleryClient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GalleryClient findUnique
   */
  export type GalleryClientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * Filter, which GalleryClient to fetch.
     */
    where: GalleryClientWhereUniqueInput
  }

  /**
   * GalleryClient findUniqueOrThrow
   */
  export type GalleryClientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * Filter, which GalleryClient to fetch.
     */
    where: GalleryClientWhereUniqueInput
  }

  /**
   * GalleryClient findFirst
   */
  export type GalleryClientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * Filter, which GalleryClient to fetch.
     */
    where?: GalleryClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryClients to fetch.
     */
    orderBy?: GalleryClientOrderByWithRelationInput | GalleryClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GalleryClients.
     */
    cursor?: GalleryClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryClients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryClients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryClients.
     */
    distinct?: GalleryClientScalarFieldEnum | GalleryClientScalarFieldEnum[]
  }

  /**
   * GalleryClient findFirstOrThrow
   */
  export type GalleryClientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * Filter, which GalleryClient to fetch.
     */
    where?: GalleryClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryClients to fetch.
     */
    orderBy?: GalleryClientOrderByWithRelationInput | GalleryClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GalleryClients.
     */
    cursor?: GalleryClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryClients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryClients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GalleryClients.
     */
    distinct?: GalleryClientScalarFieldEnum | GalleryClientScalarFieldEnum[]
  }

  /**
   * GalleryClient findMany
   */
  export type GalleryClientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * Filter, which GalleryClients to fetch.
     */
    where?: GalleryClientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GalleryClients to fetch.
     */
    orderBy?: GalleryClientOrderByWithRelationInput | GalleryClientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GalleryClients.
     */
    cursor?: GalleryClientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GalleryClients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GalleryClients.
     */
    skip?: number
    distinct?: GalleryClientScalarFieldEnum | GalleryClientScalarFieldEnum[]
  }

  /**
   * GalleryClient create
   */
  export type GalleryClientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * The data needed to create a GalleryClient.
     */
    data: XOR<GalleryClientCreateInput, GalleryClientUncheckedCreateInput>
  }

  /**
   * GalleryClient createMany
   */
  export type GalleryClientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GalleryClients.
     */
    data: GalleryClientCreateManyInput | GalleryClientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GalleryClient createManyAndReturn
   */
  export type GalleryClientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * The data used to create many GalleryClients.
     */
    data: GalleryClientCreateManyInput | GalleryClientCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GalleryClient update
   */
  export type GalleryClientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * The data needed to update a GalleryClient.
     */
    data: XOR<GalleryClientUpdateInput, GalleryClientUncheckedUpdateInput>
    /**
     * Choose, which GalleryClient to update.
     */
    where: GalleryClientWhereUniqueInput
  }

  /**
   * GalleryClient updateMany
   */
  export type GalleryClientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GalleryClients.
     */
    data: XOR<GalleryClientUpdateManyMutationInput, GalleryClientUncheckedUpdateManyInput>
    /**
     * Filter which GalleryClients to update
     */
    where?: GalleryClientWhereInput
    /**
     * Limit how many GalleryClients to update.
     */
    limit?: number
  }

  /**
   * GalleryClient updateManyAndReturn
   */
  export type GalleryClientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * The data used to update GalleryClients.
     */
    data: XOR<GalleryClientUpdateManyMutationInput, GalleryClientUncheckedUpdateManyInput>
    /**
     * Filter which GalleryClients to update
     */
    where?: GalleryClientWhereInput
    /**
     * Limit how many GalleryClients to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GalleryClient upsert
   */
  export type GalleryClientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * The filter to search for the GalleryClient to update in case it exists.
     */
    where: GalleryClientWhereUniqueInput
    /**
     * In case the GalleryClient found by the `where` argument doesn't exist, create a new GalleryClient with this data.
     */
    create: XOR<GalleryClientCreateInput, GalleryClientUncheckedCreateInput>
    /**
     * In case the GalleryClient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GalleryClientUpdateInput, GalleryClientUncheckedUpdateInput>
  }

  /**
   * GalleryClient delete
   */
  export type GalleryClientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
    /**
     * Filter which GalleryClient to delete.
     */
    where: GalleryClientWhereUniqueInput
  }

  /**
   * GalleryClient deleteMany
   */
  export type GalleryClientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GalleryClients to delete
     */
    where?: GalleryClientWhereInput
    /**
     * Limit how many GalleryClients to delete.
     */
    limit?: number
  }

  /**
   * GalleryClient without action
   */
  export type GalleryClientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GalleryClient
     */
    select?: GalleryClientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GalleryClient
     */
    omit?: GalleryClientOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GalleryClientInclude<ExtArgs> | null
  }


  /**
   * Model Album
   */

  export type AggregateAlbum = {
    _count: AlbumCountAggregateOutputType | null
    _min: AlbumMinAggregateOutputType | null
    _max: AlbumMaxAggregateOutputType | null
  }

  export type AlbumMinAggregateOutputType = {
    id: string | null
    galleryId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlbumMaxAggregateOutputType = {
    id: string | null
    galleryId: string | null
    title: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AlbumCountAggregateOutputType = {
    id: number
    galleryId: number
    title: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AlbumMinAggregateInputType = {
    id?: true
    galleryId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlbumMaxAggregateInputType = {
    id?: true
    galleryId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AlbumCountAggregateInputType = {
    id?: true
    galleryId?: true
    title?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AlbumAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Album to aggregate.
     */
    where?: AlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Albums to fetch.
     */
    orderBy?: AlbumOrderByWithRelationInput | AlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Albums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Albums.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Albums
    **/
    _count?: true | AlbumCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlbumMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlbumMaxAggregateInputType
  }

  export type GetAlbumAggregateType<T extends AlbumAggregateArgs> = {
        [P in keyof T & keyof AggregateAlbum]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlbum[P]>
      : GetScalarType<T[P], AggregateAlbum[P]>
  }




  export type AlbumGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumWhereInput
    orderBy?: AlbumOrderByWithAggregationInput | AlbumOrderByWithAggregationInput[]
    by: AlbumScalarFieldEnum[] | AlbumScalarFieldEnum
    having?: AlbumScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlbumCountAggregateInputType | true
    _min?: AlbumMinAggregateInputType
    _max?: AlbumMaxAggregateInputType
  }

  export type AlbumGroupByOutputType = {
    id: string
    galleryId: string
    title: string
    createdAt: Date
    updatedAt: Date
    _count: AlbumCountAggregateOutputType | null
    _min: AlbumMinAggregateOutputType | null
    _max: AlbumMaxAggregateOutputType | null
  }

  type GetAlbumGroupByPayload<T extends AlbumGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlbumGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlbumGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlbumGroupByOutputType[P]>
            : GetScalarType<T[P], AlbumGroupByOutputType[P]>
        }
      >
    >


  export type AlbumSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    galleryId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    photos?: boolean | Album$photosArgs<ExtArgs>
    _count?: boolean | AlbumCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["album"]>

  export type AlbumSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    galleryId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["album"]>

  export type AlbumSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    galleryId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["album"]>

  export type AlbumSelectScalar = {
    id?: boolean
    galleryId?: boolean
    title?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AlbumOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "galleryId" | "title" | "createdAt" | "updatedAt", ExtArgs["result"]["album"]>
  export type AlbumInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
    photos?: boolean | Album$photosArgs<ExtArgs>
    _count?: boolean | AlbumCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AlbumIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }
  export type AlbumIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gallery?: boolean | GalleryDefaultArgs<ExtArgs>
  }

  export type $AlbumPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Album"
    objects: {
      gallery: Prisma.$GalleryPayload<ExtArgs>
      photos: Prisma.$AlbumPhotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      galleryId: string
      title: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["album"]>
    composites: {}
  }

  type AlbumGetPayload<S extends boolean | null | undefined | AlbumDefaultArgs> = $Result.GetResult<Prisma.$AlbumPayload, S>

  type AlbumCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlbumFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlbumCountAggregateInputType | true
    }

  export interface AlbumDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Album'], meta: { name: 'Album' } }
    /**
     * Find zero or one Album that matches the filter.
     * @param {AlbumFindUniqueArgs} args - Arguments to find a Album
     * @example
     * // Get one Album
     * const album = await prisma.album.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlbumFindUniqueArgs>(args: SelectSubset<T, AlbumFindUniqueArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Album that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlbumFindUniqueOrThrowArgs} args - Arguments to find a Album
     * @example
     * // Get one Album
     * const album = await prisma.album.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlbumFindUniqueOrThrowArgs>(args: SelectSubset<T, AlbumFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Album that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumFindFirstArgs} args - Arguments to find a Album
     * @example
     * // Get one Album
     * const album = await prisma.album.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlbumFindFirstArgs>(args?: SelectSubset<T, AlbumFindFirstArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Album that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumFindFirstOrThrowArgs} args - Arguments to find a Album
     * @example
     * // Get one Album
     * const album = await prisma.album.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlbumFindFirstOrThrowArgs>(args?: SelectSubset<T, AlbumFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Albums that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Albums
     * const albums = await prisma.album.findMany()
     * 
     * // Get first 10 Albums
     * const albums = await prisma.album.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const albumWithIdOnly = await prisma.album.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AlbumFindManyArgs>(args?: SelectSubset<T, AlbumFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Album.
     * @param {AlbumCreateArgs} args - Arguments to create a Album.
     * @example
     * // Create one Album
     * const Album = await prisma.album.create({
     *   data: {
     *     // ... data to create a Album
     *   }
     * })
     * 
     */
    create<T extends AlbumCreateArgs>(args: SelectSubset<T, AlbumCreateArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Albums.
     * @param {AlbumCreateManyArgs} args - Arguments to create many Albums.
     * @example
     * // Create many Albums
     * const album = await prisma.album.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlbumCreateManyArgs>(args?: SelectSubset<T, AlbumCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Albums and returns the data saved in the database.
     * @param {AlbumCreateManyAndReturnArgs} args - Arguments to create many Albums.
     * @example
     * // Create many Albums
     * const album = await prisma.album.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Albums and only return the `id`
     * const albumWithIdOnly = await prisma.album.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlbumCreateManyAndReturnArgs>(args?: SelectSubset<T, AlbumCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Album.
     * @param {AlbumDeleteArgs} args - Arguments to delete one Album.
     * @example
     * // Delete one Album
     * const Album = await prisma.album.delete({
     *   where: {
     *     // ... filter to delete one Album
     *   }
     * })
     * 
     */
    delete<T extends AlbumDeleteArgs>(args: SelectSubset<T, AlbumDeleteArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Album.
     * @param {AlbumUpdateArgs} args - Arguments to update one Album.
     * @example
     * // Update one Album
     * const album = await prisma.album.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlbumUpdateArgs>(args: SelectSubset<T, AlbumUpdateArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Albums.
     * @param {AlbumDeleteManyArgs} args - Arguments to filter Albums to delete.
     * @example
     * // Delete a few Albums
     * const { count } = await prisma.album.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlbumDeleteManyArgs>(args?: SelectSubset<T, AlbumDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Albums.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Albums
     * const album = await prisma.album.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlbumUpdateManyArgs>(args: SelectSubset<T, AlbumUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Albums and returns the data updated in the database.
     * @param {AlbumUpdateManyAndReturnArgs} args - Arguments to update many Albums.
     * @example
     * // Update many Albums
     * const album = await prisma.album.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Albums and only return the `id`
     * const albumWithIdOnly = await prisma.album.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AlbumUpdateManyAndReturnArgs>(args: SelectSubset<T, AlbumUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Album.
     * @param {AlbumUpsertArgs} args - Arguments to update or create a Album.
     * @example
     * // Update or create a Album
     * const album = await prisma.album.upsert({
     *   create: {
     *     // ... data to create a Album
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Album we want to update
     *   }
     * })
     */
    upsert<T extends AlbumUpsertArgs>(args: SelectSubset<T, AlbumUpsertArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Albums.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumCountArgs} args - Arguments to filter Albums to count.
     * @example
     * // Count the number of Albums
     * const count = await prisma.album.count({
     *   where: {
     *     // ... the filter for the Albums we want to count
     *   }
     * })
    **/
    count<T extends AlbumCountArgs>(
      args?: Subset<T, AlbumCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlbumCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Album.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlbumAggregateArgs>(args: Subset<T, AlbumAggregateArgs>): Prisma.PrismaPromise<GetAlbumAggregateType<T>>

    /**
     * Group by Album.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlbumGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlbumGroupByArgs['orderBy'] }
        : { orderBy?: AlbumGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlbumGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlbumGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Album model
   */
  readonly fields: AlbumFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Album.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlbumClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gallery<T extends GalleryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GalleryDefaultArgs<ExtArgs>>): Prisma__GalleryClient<$Result.GetResult<Prisma.$GalleryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    photos<T extends Album$photosArgs<ExtArgs> = {}>(args?: Subset<T, Album$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Album model
   */
  interface AlbumFieldRefs {
    readonly id: FieldRef<"Album", 'String'>
    readonly galleryId: FieldRef<"Album", 'String'>
    readonly title: FieldRef<"Album", 'String'>
    readonly createdAt: FieldRef<"Album", 'DateTime'>
    readonly updatedAt: FieldRef<"Album", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Album findUnique
   */
  export type AlbumFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * Filter, which Album to fetch.
     */
    where: AlbumWhereUniqueInput
  }

  /**
   * Album findUniqueOrThrow
   */
  export type AlbumFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * Filter, which Album to fetch.
     */
    where: AlbumWhereUniqueInput
  }

  /**
   * Album findFirst
   */
  export type AlbumFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * Filter, which Album to fetch.
     */
    where?: AlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Albums to fetch.
     */
    orderBy?: AlbumOrderByWithRelationInput | AlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Albums.
     */
    cursor?: AlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Albums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Albums.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Albums.
     */
    distinct?: AlbumScalarFieldEnum | AlbumScalarFieldEnum[]
  }

  /**
   * Album findFirstOrThrow
   */
  export type AlbumFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * Filter, which Album to fetch.
     */
    where?: AlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Albums to fetch.
     */
    orderBy?: AlbumOrderByWithRelationInput | AlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Albums.
     */
    cursor?: AlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Albums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Albums.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Albums.
     */
    distinct?: AlbumScalarFieldEnum | AlbumScalarFieldEnum[]
  }

  /**
   * Album findMany
   */
  export type AlbumFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * Filter, which Albums to fetch.
     */
    where?: AlbumWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Albums to fetch.
     */
    orderBy?: AlbumOrderByWithRelationInput | AlbumOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Albums.
     */
    cursor?: AlbumWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Albums from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Albums.
     */
    skip?: number
    distinct?: AlbumScalarFieldEnum | AlbumScalarFieldEnum[]
  }

  /**
   * Album create
   */
  export type AlbumCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * The data needed to create a Album.
     */
    data: XOR<AlbumCreateInput, AlbumUncheckedCreateInput>
  }

  /**
   * Album createMany
   */
  export type AlbumCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Albums.
     */
    data: AlbumCreateManyInput | AlbumCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Album createManyAndReturn
   */
  export type AlbumCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * The data used to create many Albums.
     */
    data: AlbumCreateManyInput | AlbumCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Album update
   */
  export type AlbumUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * The data needed to update a Album.
     */
    data: XOR<AlbumUpdateInput, AlbumUncheckedUpdateInput>
    /**
     * Choose, which Album to update.
     */
    where: AlbumWhereUniqueInput
  }

  /**
   * Album updateMany
   */
  export type AlbumUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Albums.
     */
    data: XOR<AlbumUpdateManyMutationInput, AlbumUncheckedUpdateManyInput>
    /**
     * Filter which Albums to update
     */
    where?: AlbumWhereInput
    /**
     * Limit how many Albums to update.
     */
    limit?: number
  }

  /**
   * Album updateManyAndReturn
   */
  export type AlbumUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * The data used to update Albums.
     */
    data: XOR<AlbumUpdateManyMutationInput, AlbumUncheckedUpdateManyInput>
    /**
     * Filter which Albums to update
     */
    where?: AlbumWhereInput
    /**
     * Limit how many Albums to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Album upsert
   */
  export type AlbumUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * The filter to search for the Album to update in case it exists.
     */
    where: AlbumWhereUniqueInput
    /**
     * In case the Album found by the `where` argument doesn't exist, create a new Album with this data.
     */
    create: XOR<AlbumCreateInput, AlbumUncheckedCreateInput>
    /**
     * In case the Album was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlbumUpdateInput, AlbumUncheckedUpdateInput>
  }

  /**
   * Album delete
   */
  export type AlbumDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
    /**
     * Filter which Album to delete.
     */
    where: AlbumWhereUniqueInput
  }

  /**
   * Album deleteMany
   */
  export type AlbumDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Albums to delete
     */
    where?: AlbumWhereInput
    /**
     * Limit how many Albums to delete.
     */
    limit?: number
  }

  /**
   * Album.photos
   */
  export type Album$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    where?: AlbumPhotoWhereInput
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    cursor?: AlbumPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * Album without action
   */
  export type AlbumDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Album
     */
    select?: AlbumSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Album
     */
    omit?: AlbumOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumInclude<ExtArgs> | null
  }


  /**
   * Model AlbumPhoto
   */

  export type AggregateAlbumPhoto = {
    _count: AlbumPhotoCountAggregateOutputType | null
    _min: AlbumPhotoMinAggregateOutputType | null
    _max: AlbumPhotoMaxAggregateOutputType | null
  }

  export type AlbumPhotoMinAggregateOutputType = {
    albumId: string | null
    photoId: string | null
    createdAt: Date | null
  }

  export type AlbumPhotoMaxAggregateOutputType = {
    albumId: string | null
    photoId: string | null
    createdAt: Date | null
  }

  export type AlbumPhotoCountAggregateOutputType = {
    albumId: number
    photoId: number
    createdAt: number
    _all: number
  }


  export type AlbumPhotoMinAggregateInputType = {
    albumId?: true
    photoId?: true
    createdAt?: true
  }

  export type AlbumPhotoMaxAggregateInputType = {
    albumId?: true
    photoId?: true
    createdAt?: true
  }

  export type AlbumPhotoCountAggregateInputType = {
    albumId?: true
    photoId?: true
    createdAt?: true
    _all?: true
  }

  export type AlbumPhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlbumPhoto to aggregate.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AlbumPhotos
    **/
    _count?: true | AlbumPhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AlbumPhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AlbumPhotoMaxAggregateInputType
  }

  export type GetAlbumPhotoAggregateType<T extends AlbumPhotoAggregateArgs> = {
        [P in keyof T & keyof AggregateAlbumPhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAlbumPhoto[P]>
      : GetScalarType<T[P], AggregateAlbumPhoto[P]>
  }




  export type AlbumPhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AlbumPhotoWhereInput
    orderBy?: AlbumPhotoOrderByWithAggregationInput | AlbumPhotoOrderByWithAggregationInput[]
    by: AlbumPhotoScalarFieldEnum[] | AlbumPhotoScalarFieldEnum
    having?: AlbumPhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AlbumPhotoCountAggregateInputType | true
    _min?: AlbumPhotoMinAggregateInputType
    _max?: AlbumPhotoMaxAggregateInputType
  }

  export type AlbumPhotoGroupByOutputType = {
    albumId: string
    photoId: string
    createdAt: Date
    _count: AlbumPhotoCountAggregateOutputType | null
    _min: AlbumPhotoMinAggregateOutputType | null
    _max: AlbumPhotoMaxAggregateOutputType | null
  }

  type GetAlbumPhotoGroupByPayload<T extends AlbumPhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AlbumPhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AlbumPhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AlbumPhotoGroupByOutputType[P]>
            : GetScalarType<T[P], AlbumPhotoGroupByOutputType[P]>
        }
      >
    >


  export type AlbumPhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    albumId?: boolean
    photoId?: boolean
    createdAt?: boolean
    album?: boolean | AlbumDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["albumPhoto"]>

  export type AlbumPhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    albumId?: boolean
    photoId?: boolean
    createdAt?: boolean
    album?: boolean | AlbumDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["albumPhoto"]>

  export type AlbumPhotoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    albumId?: boolean
    photoId?: boolean
    createdAt?: boolean
    album?: boolean | AlbumDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["albumPhoto"]>

  export type AlbumPhotoSelectScalar = {
    albumId?: boolean
    photoId?: boolean
    createdAt?: boolean
  }

  export type AlbumPhotoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"albumId" | "photoId" | "createdAt", ExtArgs["result"]["albumPhoto"]>
  export type AlbumPhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    album?: boolean | AlbumDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }
  export type AlbumPhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    album?: boolean | AlbumDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }
  export type AlbumPhotoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    album?: boolean | AlbumDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }

  export type $AlbumPhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AlbumPhoto"
    objects: {
      album: Prisma.$AlbumPayload<ExtArgs>
      photo: Prisma.$PhotoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      albumId: string
      photoId: string
      createdAt: Date
    }, ExtArgs["result"]["albumPhoto"]>
    composites: {}
  }

  type AlbumPhotoGetPayload<S extends boolean | null | undefined | AlbumPhotoDefaultArgs> = $Result.GetResult<Prisma.$AlbumPhotoPayload, S>

  type AlbumPhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AlbumPhotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AlbumPhotoCountAggregateInputType | true
    }

  export interface AlbumPhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AlbumPhoto'], meta: { name: 'AlbumPhoto' } }
    /**
     * Find zero or one AlbumPhoto that matches the filter.
     * @param {AlbumPhotoFindUniqueArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AlbumPhotoFindUniqueArgs>(args: SelectSubset<T, AlbumPhotoFindUniqueArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AlbumPhoto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AlbumPhotoFindUniqueOrThrowArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AlbumPhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, AlbumPhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AlbumPhoto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoFindFirstArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AlbumPhotoFindFirstArgs>(args?: SelectSubset<T, AlbumPhotoFindFirstArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AlbumPhoto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoFindFirstOrThrowArgs} args - Arguments to find a AlbumPhoto
     * @example
     * // Get one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AlbumPhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, AlbumPhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AlbumPhotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AlbumPhotos
     * const albumPhotos = await prisma.albumPhoto.findMany()
     * 
     * // Get first 10 AlbumPhotos
     * const albumPhotos = await prisma.albumPhoto.findMany({ take: 10 })
     * 
     * // Only select the `albumId`
     * const albumPhotoWithAlbumIdOnly = await prisma.albumPhoto.findMany({ select: { albumId: true } })
     * 
     */
    findMany<T extends AlbumPhotoFindManyArgs>(args?: SelectSubset<T, AlbumPhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AlbumPhoto.
     * @param {AlbumPhotoCreateArgs} args - Arguments to create a AlbumPhoto.
     * @example
     * // Create one AlbumPhoto
     * const AlbumPhoto = await prisma.albumPhoto.create({
     *   data: {
     *     // ... data to create a AlbumPhoto
     *   }
     * })
     * 
     */
    create<T extends AlbumPhotoCreateArgs>(args: SelectSubset<T, AlbumPhotoCreateArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AlbumPhotos.
     * @param {AlbumPhotoCreateManyArgs} args - Arguments to create many AlbumPhotos.
     * @example
     * // Create many AlbumPhotos
     * const albumPhoto = await prisma.albumPhoto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AlbumPhotoCreateManyArgs>(args?: SelectSubset<T, AlbumPhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AlbumPhotos and returns the data saved in the database.
     * @param {AlbumPhotoCreateManyAndReturnArgs} args - Arguments to create many AlbumPhotos.
     * @example
     * // Create many AlbumPhotos
     * const albumPhoto = await prisma.albumPhoto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AlbumPhotos and only return the `albumId`
     * const albumPhotoWithAlbumIdOnly = await prisma.albumPhoto.createManyAndReturn({
     *   select: { albumId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AlbumPhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, AlbumPhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AlbumPhoto.
     * @param {AlbumPhotoDeleteArgs} args - Arguments to delete one AlbumPhoto.
     * @example
     * // Delete one AlbumPhoto
     * const AlbumPhoto = await prisma.albumPhoto.delete({
     *   where: {
     *     // ... filter to delete one AlbumPhoto
     *   }
     * })
     * 
     */
    delete<T extends AlbumPhotoDeleteArgs>(args: SelectSubset<T, AlbumPhotoDeleteArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AlbumPhoto.
     * @param {AlbumPhotoUpdateArgs} args - Arguments to update one AlbumPhoto.
     * @example
     * // Update one AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AlbumPhotoUpdateArgs>(args: SelectSubset<T, AlbumPhotoUpdateArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AlbumPhotos.
     * @param {AlbumPhotoDeleteManyArgs} args - Arguments to filter AlbumPhotos to delete.
     * @example
     * // Delete a few AlbumPhotos
     * const { count } = await prisma.albumPhoto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AlbumPhotoDeleteManyArgs>(args?: SelectSubset<T, AlbumPhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlbumPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AlbumPhotos
     * const albumPhoto = await prisma.albumPhoto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AlbumPhotoUpdateManyArgs>(args: SelectSubset<T, AlbumPhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AlbumPhotos and returns the data updated in the database.
     * @param {AlbumPhotoUpdateManyAndReturnArgs} args - Arguments to update many AlbumPhotos.
     * @example
     * // Update many AlbumPhotos
     * const albumPhoto = await prisma.albumPhoto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AlbumPhotos and only return the `albumId`
     * const albumPhotoWithAlbumIdOnly = await prisma.albumPhoto.updateManyAndReturn({
     *   select: { albumId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AlbumPhotoUpdateManyAndReturnArgs>(args: SelectSubset<T, AlbumPhotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AlbumPhoto.
     * @param {AlbumPhotoUpsertArgs} args - Arguments to update or create a AlbumPhoto.
     * @example
     * // Update or create a AlbumPhoto
     * const albumPhoto = await prisma.albumPhoto.upsert({
     *   create: {
     *     // ... data to create a AlbumPhoto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AlbumPhoto we want to update
     *   }
     * })
     */
    upsert<T extends AlbumPhotoUpsertArgs>(args: SelectSubset<T, AlbumPhotoUpsertArgs<ExtArgs>>): Prisma__AlbumPhotoClient<$Result.GetResult<Prisma.$AlbumPhotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AlbumPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoCountArgs} args - Arguments to filter AlbumPhotos to count.
     * @example
     * // Count the number of AlbumPhotos
     * const count = await prisma.albumPhoto.count({
     *   where: {
     *     // ... the filter for the AlbumPhotos we want to count
     *   }
     * })
    **/
    count<T extends AlbumPhotoCountArgs>(
      args?: Subset<T, AlbumPhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AlbumPhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AlbumPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AlbumPhotoAggregateArgs>(args: Subset<T, AlbumPhotoAggregateArgs>): Prisma.PrismaPromise<GetAlbumPhotoAggregateType<T>>

    /**
     * Group by AlbumPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AlbumPhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AlbumPhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AlbumPhotoGroupByArgs['orderBy'] }
        : { orderBy?: AlbumPhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AlbumPhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAlbumPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AlbumPhoto model
   */
  readonly fields: AlbumPhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AlbumPhoto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AlbumPhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    album<T extends AlbumDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AlbumDefaultArgs<ExtArgs>>): Prisma__AlbumClient<$Result.GetResult<Prisma.$AlbumPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    photo<T extends PhotoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PhotoDefaultArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AlbumPhoto model
   */
  interface AlbumPhotoFieldRefs {
    readonly albumId: FieldRef<"AlbumPhoto", 'String'>
    readonly photoId: FieldRef<"AlbumPhoto", 'String'>
    readonly createdAt: FieldRef<"AlbumPhoto", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AlbumPhoto findUnique
   */
  export type AlbumPhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto findUniqueOrThrow
   */
  export type AlbumPhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto findFirst
   */
  export type AlbumPhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlbumPhotos.
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlbumPhotos.
     */
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * AlbumPhoto findFirstOrThrow
   */
  export type AlbumPhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhoto to fetch.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AlbumPhotos.
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AlbumPhotos.
     */
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * AlbumPhoto findMany
   */
  export type AlbumPhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter, which AlbumPhotos to fetch.
     */
    where?: AlbumPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AlbumPhotos to fetch.
     */
    orderBy?: AlbumPhotoOrderByWithRelationInput | AlbumPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AlbumPhotos.
     */
    cursor?: AlbumPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AlbumPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AlbumPhotos.
     */
    skip?: number
    distinct?: AlbumPhotoScalarFieldEnum | AlbumPhotoScalarFieldEnum[]
  }

  /**
   * AlbumPhoto create
   */
  export type AlbumPhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a AlbumPhoto.
     */
    data: XOR<AlbumPhotoCreateInput, AlbumPhotoUncheckedCreateInput>
  }

  /**
   * AlbumPhoto createMany
   */
  export type AlbumPhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AlbumPhotos.
     */
    data: AlbumPhotoCreateManyInput | AlbumPhotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AlbumPhoto createManyAndReturn
   */
  export type AlbumPhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * The data used to create many AlbumPhotos.
     */
    data: AlbumPhotoCreateManyInput | AlbumPhotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AlbumPhoto update
   */
  export type AlbumPhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a AlbumPhoto.
     */
    data: XOR<AlbumPhotoUpdateInput, AlbumPhotoUncheckedUpdateInput>
    /**
     * Choose, which AlbumPhoto to update.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto updateMany
   */
  export type AlbumPhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AlbumPhotos.
     */
    data: XOR<AlbumPhotoUpdateManyMutationInput, AlbumPhotoUncheckedUpdateManyInput>
    /**
     * Filter which AlbumPhotos to update
     */
    where?: AlbumPhotoWhereInput
    /**
     * Limit how many AlbumPhotos to update.
     */
    limit?: number
  }

  /**
   * AlbumPhoto updateManyAndReturn
   */
  export type AlbumPhotoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * The data used to update AlbumPhotos.
     */
    data: XOR<AlbumPhotoUpdateManyMutationInput, AlbumPhotoUncheckedUpdateManyInput>
    /**
     * Filter which AlbumPhotos to update
     */
    where?: AlbumPhotoWhereInput
    /**
     * Limit how many AlbumPhotos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AlbumPhoto upsert
   */
  export type AlbumPhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the AlbumPhoto to update in case it exists.
     */
    where: AlbumPhotoWhereUniqueInput
    /**
     * In case the AlbumPhoto found by the `where` argument doesn't exist, create a new AlbumPhoto with this data.
     */
    create: XOR<AlbumPhotoCreateInput, AlbumPhotoUncheckedCreateInput>
    /**
     * In case the AlbumPhoto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AlbumPhotoUpdateInput, AlbumPhotoUncheckedUpdateInput>
  }

  /**
   * AlbumPhoto delete
   */
  export type AlbumPhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
    /**
     * Filter which AlbumPhoto to delete.
     */
    where: AlbumPhotoWhereUniqueInput
  }

  /**
   * AlbumPhoto deleteMany
   */
  export type AlbumPhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AlbumPhotos to delete
     */
    where?: AlbumPhotoWhereInput
    /**
     * Limit how many AlbumPhotos to delete.
     */
    limit?: number
  }

  /**
   * AlbumPhoto without action
   */
  export type AlbumPhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AlbumPhoto
     */
    select?: AlbumPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AlbumPhoto
     */
    omit?: AlbumPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AlbumPhotoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    plan: 'plan',
    storageUsed: 'storageUsed',
    storageLimit: 'storageLimit',
    overageBytes: 'overageBytes',
    overageResetAt: 'overageResetAt',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubId: 'stripeSubId',
    warningEmailSent80: 'warningEmailSent80',
    warningEmailSent95: 'warningEmailSent95',
    emailVerified: 'emailVerified',
    image: 'image',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    role: 'role',
    banned: 'banned',
    banReason: 'banReason',
    banExpires: 'banExpires',
    subscribed: 'subscribed',
    finishOnboarding: 'finishOnboarding'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    expiresAt: 'expiresAt',
    token: 'token',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    userId: 'userId',
    impersonatedBy: 'impersonatedBy'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    accountId: 'accountId',
    providerId: 'providerId',
    userId: 'userId',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    idToken: 'idToken',
    accessTokenExpiresAt: 'accessTokenExpiresAt',
    refreshTokenExpiresAt: 'refreshTokenExpiresAt',
    scope: 'scope',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const VerificationScalarFieldEnum: {
    id: 'id',
    identifier: 'identifier',
    value: 'value',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type VerificationScalarFieldEnum = (typeof VerificationScalarFieldEnum)[keyof typeof VerificationScalarFieldEnum]


  export const PaymentScalarFieldEnum: {
    id: 'id',
    planId: 'planId',
    plan: 'plan',
    planExpiresAt: 'planExpiresAt',
    planStartedAt: 'planStartedAt',
    amount_cents: 'amount_cents',
    transactionId: 'transactionId',
    initial_transaction: 'initial_transaction',
    subscriptionId: 'subscriptionId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    status: 'status',
    userId: 'userId'
  };

  export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum]


  export const UserOnboardingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    userType: 'userType',
    companyName: 'companyName',
    companySize: 'companySize',
    photographyType: 'photographyType',
    photographyLevel: 'photographyLevel',
    contactMethod: 'contactMethod',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserOnboardingScalarFieldEnum = (typeof UserOnboardingScalarFieldEnum)[keyof typeof UserOnboardingScalarFieldEnum]


  export const GalleryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    slug: 'slug',
    eventDate: 'eventDate',
    deadline: 'deadline',
    coverPhotoId: 'coverPhotoId',
    passwordHash: 'passwordHash',
    shareToken: 'shareToken',
    isPublished: 'isPublished',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GalleryScalarFieldEnum = (typeof GalleryScalarFieldEnum)[keyof typeof GalleryScalarFieldEnum]


  export const PhotoScalarFieldEnum: {
    id: 'id',
    galleryId: 'galleryId',
    s3Key: 's3Key',
    s3Bucket: 's3Bucket',
    originalFilename: 'originalFilename',
    originalSize: 'originalSize',
    thumbnailSize: 'thumbnailSize',
    previewSize: 'previewSize',
    totalSize: 'totalSize',
    width: 'width',
    height: 'height',
    mimeType: 'mimeType',
    order: 'order',
    isCulled: 'isCulled',
    loved: 'loved',
    aiCaption: 'aiCaption',
    aiTags: 'aiTags',
    faceCount: 'faceCount',
    thumbnailKey: 'thumbnailKey',
    previewKey: 'previewKey',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type PhotoScalarFieldEnum = (typeof PhotoScalarFieldEnum)[keyof typeof PhotoScalarFieldEnum]


  export const StorageEventScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    photoId: 'photoId',
    delta: 'delta',
    reason: 'reason',
    createdAt: 'createdAt'
  };

  export type StorageEventScalarFieldEnum = (typeof StorageEventScalarFieldEnum)[keyof typeof StorageEventScalarFieldEnum]


  export const ClientScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    email: 'email',
    phone: 'phone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ClientScalarFieldEnum = (typeof ClientScalarFieldEnum)[keyof typeof ClientScalarFieldEnum]


  export const GalleryClientScalarFieldEnum: {
    galleryId: 'galleryId',
    clientId: 'clientId',
    createdAt: 'createdAt'
  };

  export type GalleryClientScalarFieldEnum = (typeof GalleryClientScalarFieldEnum)[keyof typeof GalleryClientScalarFieldEnum]


  export const AlbumScalarFieldEnum: {
    id: 'id',
    galleryId: 'galleryId',
    title: 'title',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AlbumScalarFieldEnum = (typeof AlbumScalarFieldEnum)[keyof typeof AlbumScalarFieldEnum]


  export const AlbumPhotoScalarFieldEnum: {
    albumId: 'albumId',
    photoId: 'photoId',
    createdAt: 'createdAt'
  };

  export type AlbumPhotoScalarFieldEnum = (typeof AlbumPhotoScalarFieldEnum)[keyof typeof AlbumPhotoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Plan'
   */
  export type EnumPlanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Plan'>
    


  /**
   * Reference to a field of type 'Plan[]'
   */
  export type ListEnumPlanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Plan[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'PlanType'
   */
  export type EnumPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanType'>
    


  /**
   * Reference to a field of type 'PlanType[]'
   */
  export type ListEnumPlanTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlanType[]'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'UserType'
   */
  export type EnumUserTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserType'>
    


  /**
   * Reference to a field of type 'UserType[]'
   */
  export type ListEnumUserTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserType[]'>
    


  /**
   * Reference to a field of type 'PhotographyLevel'
   */
  export type EnumPhotographyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PhotographyLevel'>
    


  /**
   * Reference to a field of type 'PhotographyLevel[]'
   */
  export type ListEnumPhotographyLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PhotographyLevel[]'>
    


  /**
   * Reference to a field of type 'ContactMethod'
   */
  export type EnumContactMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContactMethod'>
    


  /**
   * Reference to a field of type 'ContactMethod[]'
   */
  export type ListEnumContactMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ContactMethod[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    plan?: EnumPlanFilter<"User"> | $Enums.Plan
    storageUsed?: BigIntFilter<"User"> | bigint | number
    storageLimit?: BigIntFilter<"User"> | bigint | number
    overageBytes?: BigIntFilter<"User"> | bigint | number
    overageResetAt?: DateTimeNullableFilter<"User"> | Date | string | null
    stripeCustomerId?: StringNullableFilter<"User"> | string | null
    stripeSubId?: StringNullableFilter<"User"> | string | null
    warningEmailSent80?: BoolFilter<"User"> | boolean
    warningEmailSent95?: BoolFilter<"User"> | boolean
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    role?: StringNullableFilter<"User"> | string | null
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    subscribed?: BoolNullableFilter<"User"> | boolean | null
    finishOnboarding?: BoolNullableFilter<"User"> | boolean | null
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    payment?: PaymentListRelationFilter
    userOnboarding?: XOR<UserOnboardingNullableScalarRelationFilter, UserOnboardingWhereInput> | null
    galleries?: GalleryListRelationFilter
    clients?: ClientListRelationFilter
    storageEvents?: StorageEventListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    storageUsed?: SortOrder
    storageLimit?: SortOrder
    overageBytes?: SortOrder
    overageResetAt?: SortOrderInput | SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubId?: SortOrderInput | SortOrder
    warningEmailSent80?: SortOrder
    warningEmailSent95?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrderInput | SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    subscribed?: SortOrderInput | SortOrder
    finishOnboarding?: SortOrderInput | SortOrder
    sessions?: SessionOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    payment?: PaymentOrderByRelationAggregateInput
    userOnboarding?: UserOnboardingOrderByWithRelationInput
    galleries?: GalleryOrderByRelationAggregateInput
    clients?: ClientOrderByRelationAggregateInput
    storageEvents?: StorageEventOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    stripeCustomerId?: string
    stripeSubId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    plan?: EnumPlanFilter<"User"> | $Enums.Plan
    storageUsed?: BigIntFilter<"User"> | bigint | number
    storageLimit?: BigIntFilter<"User"> | bigint | number
    overageBytes?: BigIntFilter<"User"> | bigint | number
    overageResetAt?: DateTimeNullableFilter<"User"> | Date | string | null
    warningEmailSent80?: BoolFilter<"User"> | boolean
    warningEmailSent95?: BoolFilter<"User"> | boolean
    emailVerified?: BoolFilter<"User"> | boolean
    image?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    role?: StringNullableFilter<"User"> | string | null
    banned?: BoolNullableFilter<"User"> | boolean | null
    banReason?: StringNullableFilter<"User"> | string | null
    banExpires?: DateTimeNullableFilter<"User"> | Date | string | null
    subscribed?: BoolNullableFilter<"User"> | boolean | null
    finishOnboarding?: BoolNullableFilter<"User"> | boolean | null
    sessions?: SessionListRelationFilter
    accounts?: AccountListRelationFilter
    payment?: PaymentListRelationFilter
    userOnboarding?: XOR<UserOnboardingNullableScalarRelationFilter, UserOnboardingWhereInput> | null
    galleries?: GalleryListRelationFilter
    clients?: ClientListRelationFilter
    storageEvents?: StorageEventListRelationFilter
  }, "id" | "id" | "stripeCustomerId" | "stripeSubId" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    storageUsed?: SortOrder
    storageLimit?: SortOrder
    overageBytes?: SortOrder
    overageResetAt?: SortOrderInput | SortOrder
    stripeCustomerId?: SortOrderInput | SortOrder
    stripeSubId?: SortOrderInput | SortOrder
    warningEmailSent80?: SortOrder
    warningEmailSent95?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrderInput | SortOrder
    banned?: SortOrderInput | SortOrder
    banReason?: SortOrderInput | SortOrder
    banExpires?: SortOrderInput | SortOrder
    subscribed?: SortOrderInput | SortOrder
    finishOnboarding?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    plan?: EnumPlanWithAggregatesFilter<"User"> | $Enums.Plan
    storageUsed?: BigIntWithAggregatesFilter<"User"> | bigint | number
    storageLimit?: BigIntWithAggregatesFilter<"User"> | bigint | number
    overageBytes?: BigIntWithAggregatesFilter<"User"> | bigint | number
    overageResetAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    stripeCustomerId?: StringNullableWithAggregatesFilter<"User"> | string | null
    stripeSubId?: StringNullableWithAggregatesFilter<"User"> | string | null
    warningEmailSent80?: BoolWithAggregatesFilter<"User"> | boolean
    warningEmailSent95?: BoolWithAggregatesFilter<"User"> | boolean
    emailVerified?: BoolWithAggregatesFilter<"User"> | boolean
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    role?: StringNullableWithAggregatesFilter<"User"> | string | null
    banned?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    banReason?: StringNullableWithAggregatesFilter<"User"> | string | null
    banExpires?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    subscribed?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    finishOnboarding?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "id" | "token">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrderInput | SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    token?: StringWithAggregatesFilter<"Session"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    ipAddress?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"Session"> | string | null
    userId?: StringWithAggregatesFilter<"Session"> | string
    impersonatedBy?: StringNullableWithAggregatesFilter<"Session"> | string | null
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "id">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrderInput | SortOrder
    refreshToken?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    accessTokenExpiresAt?: SortOrderInput | SortOrder
    refreshTokenExpiresAt?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    accountId?: StringWithAggregatesFilter<"Account"> | string
    providerId?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableWithAggregatesFilter<"Account"> | Date | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    password?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type VerificationWhereInput = {
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    id?: StringFilter<"Verification"> | string
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
  }

  export type VerificationOrderByWithRelationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
  }

  export type VerificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: VerificationWhereInput | VerificationWhereInput[]
    OR?: VerificationWhereInput[]
    NOT?: VerificationWhereInput | VerificationWhereInput[]
    identifier?: StringFilter<"Verification"> | string
    value?: StringFilter<"Verification"> | string
    expiresAt?: DateTimeFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableFilter<"Verification"> | Date | string | null
  }, "id" | "id">

  export type VerificationOrderByWithAggregationInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: VerificationCountOrderByAggregateInput
    _max?: VerificationMaxOrderByAggregateInput
    _min?: VerificationMinOrderByAggregateInput
  }

  export type VerificationScalarWhereWithAggregatesInput = {
    AND?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    OR?: VerificationScalarWhereWithAggregatesInput[]
    NOT?: VerificationScalarWhereWithAggregatesInput | VerificationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Verification"> | string
    identifier?: StringWithAggregatesFilter<"Verification"> | string
    value?: StringWithAggregatesFilter<"Verification"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"Verification"> | Date | string
    createdAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Verification"> | Date | string | null
  }

  export type PaymentWhereInput = {
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    id?: IntFilter<"Payment"> | number
    planId?: IntFilter<"Payment"> | number
    plan?: EnumPlanTypeFilter<"Payment"> | $Enums.PlanType
    planExpiresAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    planStartedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    amount_cents?: IntFilter<"Payment"> | number
    transactionId?: IntFilter<"Payment"> | number
    initial_transaction?: IntFilter<"Payment"> | number
    subscriptionId?: IntFilter<"Payment"> | number
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    status?: EnumSubscriptionStatusFilter<"Payment"> | $Enums.SubscriptionStatus
    userId?: StringFilter<"Payment"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PaymentOrderByWithRelationInput = {
    id?: SortOrder
    planId?: SortOrder
    plan?: SortOrder
    planExpiresAt?: SortOrderInput | SortOrder
    planStartedAt?: SortOrderInput | SortOrder
    amount_cents?: SortOrder
    transactionId?: SortOrder
    initial_transaction?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    transactionId?: number
    subscriptionId?: number
    AND?: PaymentWhereInput | PaymentWhereInput[]
    OR?: PaymentWhereInput[]
    NOT?: PaymentWhereInput | PaymentWhereInput[]
    planId?: IntFilter<"Payment"> | number
    plan?: EnumPlanTypeFilter<"Payment"> | $Enums.PlanType
    planExpiresAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    planStartedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    amount_cents?: IntFilter<"Payment"> | number
    initial_transaction?: IntFilter<"Payment"> | number
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    status?: EnumSubscriptionStatusFilter<"Payment"> | $Enums.SubscriptionStatus
    userId?: StringFilter<"Payment"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "id" | "transactionId" | "subscriptionId">

  export type PaymentOrderByWithAggregationInput = {
    id?: SortOrder
    planId?: SortOrder
    plan?: SortOrder
    planExpiresAt?: SortOrderInput | SortOrder
    planStartedAt?: SortOrderInput | SortOrder
    amount_cents?: SortOrder
    transactionId?: SortOrder
    initial_transaction?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
    _count?: PaymentCountOrderByAggregateInput
    _avg?: PaymentAvgOrderByAggregateInput
    _max?: PaymentMaxOrderByAggregateInput
    _min?: PaymentMinOrderByAggregateInput
    _sum?: PaymentSumOrderByAggregateInput
  }

  export type PaymentScalarWhereWithAggregatesInput = {
    AND?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    OR?: PaymentScalarWhereWithAggregatesInput[]
    NOT?: PaymentScalarWhereWithAggregatesInput | PaymentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Payment"> | number
    planId?: IntWithAggregatesFilter<"Payment"> | number
    plan?: EnumPlanTypeWithAggregatesFilter<"Payment"> | $Enums.PlanType
    planExpiresAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    planStartedAt?: DateTimeNullableWithAggregatesFilter<"Payment"> | Date | string | null
    amount_cents?: IntWithAggregatesFilter<"Payment"> | number
    transactionId?: IntWithAggregatesFilter<"Payment"> | number
    initial_transaction?: IntWithAggregatesFilter<"Payment"> | number
    subscriptionId?: IntWithAggregatesFilter<"Payment"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Payment"> | Date | string
    status?: EnumSubscriptionStatusWithAggregatesFilter<"Payment"> | $Enums.SubscriptionStatus
    userId?: StringWithAggregatesFilter<"Payment"> | string
  }

  export type UserOnboardingWhereInput = {
    AND?: UserOnboardingWhereInput | UserOnboardingWhereInput[]
    OR?: UserOnboardingWhereInput[]
    NOT?: UserOnboardingWhereInput | UserOnboardingWhereInput[]
    id?: IntFilter<"UserOnboarding"> | number
    userId?: StringFilter<"UserOnboarding"> | string
    userType?: EnumUserTypeFilter<"UserOnboarding"> | $Enums.UserType
    companyName?: StringNullableFilter<"UserOnboarding"> | string | null
    companySize?: StringNullableFilter<"UserOnboarding"> | string | null
    photographyType?: StringNullableListFilter<"UserOnboarding">
    photographyLevel?: EnumPhotographyLevelNullableFilter<"UserOnboarding"> | $Enums.PhotographyLevel | null
    contactMethod?: EnumContactMethodNullableFilter<"UserOnboarding"> | $Enums.ContactMethod | null
    createdAt?: DateTimeFilter<"UserOnboarding"> | Date | string
    updatedAt?: DateTimeFilter<"UserOnboarding"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserOnboardingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    userType?: SortOrder
    companyName?: SortOrderInput | SortOrder
    companySize?: SortOrderInput | SortOrder
    photographyType?: SortOrder
    photographyLevel?: SortOrderInput | SortOrder
    contactMethod?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserOnboardingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId?: string
    AND?: UserOnboardingWhereInput | UserOnboardingWhereInput[]
    OR?: UserOnboardingWhereInput[]
    NOT?: UserOnboardingWhereInput | UserOnboardingWhereInput[]
    userType?: EnumUserTypeFilter<"UserOnboarding"> | $Enums.UserType
    companyName?: StringNullableFilter<"UserOnboarding"> | string | null
    companySize?: StringNullableFilter<"UserOnboarding"> | string | null
    photographyType?: StringNullableListFilter<"UserOnboarding">
    photographyLevel?: EnumPhotographyLevelNullableFilter<"UserOnboarding"> | $Enums.PhotographyLevel | null
    contactMethod?: EnumContactMethodNullableFilter<"UserOnboarding"> | $Enums.ContactMethod | null
    createdAt?: DateTimeFilter<"UserOnboarding"> | Date | string
    updatedAt?: DateTimeFilter<"UserOnboarding"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "id" | "userId">

  export type UserOnboardingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    userType?: SortOrder
    companyName?: SortOrderInput | SortOrder
    companySize?: SortOrderInput | SortOrder
    photographyType?: SortOrder
    photographyLevel?: SortOrderInput | SortOrder
    contactMethod?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserOnboardingCountOrderByAggregateInput
    _avg?: UserOnboardingAvgOrderByAggregateInput
    _max?: UserOnboardingMaxOrderByAggregateInput
    _min?: UserOnboardingMinOrderByAggregateInput
    _sum?: UserOnboardingSumOrderByAggregateInput
  }

  export type UserOnboardingScalarWhereWithAggregatesInput = {
    AND?: UserOnboardingScalarWhereWithAggregatesInput | UserOnboardingScalarWhereWithAggregatesInput[]
    OR?: UserOnboardingScalarWhereWithAggregatesInput[]
    NOT?: UserOnboardingScalarWhereWithAggregatesInput | UserOnboardingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserOnboarding"> | number
    userId?: StringWithAggregatesFilter<"UserOnboarding"> | string
    userType?: EnumUserTypeWithAggregatesFilter<"UserOnboarding"> | $Enums.UserType
    companyName?: StringNullableWithAggregatesFilter<"UserOnboarding"> | string | null
    companySize?: StringNullableWithAggregatesFilter<"UserOnboarding"> | string | null
    photographyType?: StringNullableListFilter<"UserOnboarding">
    photographyLevel?: EnumPhotographyLevelNullableWithAggregatesFilter<"UserOnboarding"> | $Enums.PhotographyLevel | null
    contactMethod?: EnumContactMethodNullableWithAggregatesFilter<"UserOnboarding"> | $Enums.ContactMethod | null
    createdAt?: DateTimeWithAggregatesFilter<"UserOnboarding"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserOnboarding"> | Date | string
  }

  export type GalleryWhereInput = {
    AND?: GalleryWhereInput | GalleryWhereInput[]
    OR?: GalleryWhereInput[]
    NOT?: GalleryWhereInput | GalleryWhereInput[]
    id?: StringFilter<"Gallery"> | string
    userId?: StringFilter<"Gallery"> | string
    title?: StringFilter<"Gallery"> | string
    slug?: StringFilter<"Gallery"> | string
    eventDate?: DateTimeNullableFilter<"Gallery"> | Date | string | null
    deadline?: DateTimeNullableFilter<"Gallery"> | Date | string | null
    coverPhotoId?: StringNullableFilter<"Gallery"> | string | null
    passwordHash?: StringNullableFilter<"Gallery"> | string | null
    shareToken?: StringFilter<"Gallery"> | string
    isPublished?: BoolFilter<"Gallery"> | boolean
    createdAt?: DateTimeFilter<"Gallery"> | Date | string
    updatedAt?: DateTimeFilter<"Gallery"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    coverPhoto?: XOR<PhotoNullableScalarRelationFilter, PhotoWhereInput> | null
    photos?: PhotoListRelationFilter
    albums?: AlbumListRelationFilter
    clients?: GalleryClientListRelationFilter
  }

  export type GalleryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    eventDate?: SortOrderInput | SortOrder
    deadline?: SortOrderInput | SortOrder
    coverPhotoId?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    shareToken?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    coverPhoto?: PhotoOrderByWithRelationInput
    photos?: PhotoOrderByRelationAggregateInput
    albums?: AlbumOrderByRelationAggregateInput
    clients?: GalleryClientOrderByRelationAggregateInput
  }

  export type GalleryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    shareToken?: string
    userId_slug?: GalleryUserIdSlugCompoundUniqueInput
    AND?: GalleryWhereInput | GalleryWhereInput[]
    OR?: GalleryWhereInput[]
    NOT?: GalleryWhereInput | GalleryWhereInput[]
    userId?: StringFilter<"Gallery"> | string
    title?: StringFilter<"Gallery"> | string
    slug?: StringFilter<"Gallery"> | string
    eventDate?: DateTimeNullableFilter<"Gallery"> | Date | string | null
    deadline?: DateTimeNullableFilter<"Gallery"> | Date | string | null
    coverPhotoId?: StringNullableFilter<"Gallery"> | string | null
    passwordHash?: StringNullableFilter<"Gallery"> | string | null
    isPublished?: BoolFilter<"Gallery"> | boolean
    createdAt?: DateTimeFilter<"Gallery"> | Date | string
    updatedAt?: DateTimeFilter<"Gallery"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    coverPhoto?: XOR<PhotoNullableScalarRelationFilter, PhotoWhereInput> | null
    photos?: PhotoListRelationFilter
    albums?: AlbumListRelationFilter
    clients?: GalleryClientListRelationFilter
  }, "id" | "id" | "shareToken" | "userId_slug">

  export type GalleryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    eventDate?: SortOrderInput | SortOrder
    deadline?: SortOrderInput | SortOrder
    coverPhotoId?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    shareToken?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GalleryCountOrderByAggregateInput
    _max?: GalleryMaxOrderByAggregateInput
    _min?: GalleryMinOrderByAggregateInput
  }

  export type GalleryScalarWhereWithAggregatesInput = {
    AND?: GalleryScalarWhereWithAggregatesInput | GalleryScalarWhereWithAggregatesInput[]
    OR?: GalleryScalarWhereWithAggregatesInput[]
    NOT?: GalleryScalarWhereWithAggregatesInput | GalleryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Gallery"> | string
    userId?: StringWithAggregatesFilter<"Gallery"> | string
    title?: StringWithAggregatesFilter<"Gallery"> | string
    slug?: StringWithAggregatesFilter<"Gallery"> | string
    eventDate?: DateTimeNullableWithAggregatesFilter<"Gallery"> | Date | string | null
    deadline?: DateTimeNullableWithAggregatesFilter<"Gallery"> | Date | string | null
    coverPhotoId?: StringNullableWithAggregatesFilter<"Gallery"> | string | null
    passwordHash?: StringNullableWithAggregatesFilter<"Gallery"> | string | null
    shareToken?: StringWithAggregatesFilter<"Gallery"> | string
    isPublished?: BoolWithAggregatesFilter<"Gallery"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Gallery"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Gallery"> | Date | string
  }

  export type PhotoWhereInput = {
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    id?: StringFilter<"Photo"> | string
    galleryId?: StringFilter<"Photo"> | string
    s3Key?: StringFilter<"Photo"> | string
    s3Bucket?: StringFilter<"Photo"> | string
    originalFilename?: StringFilter<"Photo"> | string
    originalSize?: BigIntFilter<"Photo"> | bigint | number
    thumbnailSize?: BigIntFilter<"Photo"> | bigint | number
    previewSize?: BigIntFilter<"Photo"> | bigint | number
    totalSize?: BigIntFilter<"Photo"> | bigint | number
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    mimeType?: StringFilter<"Photo"> | string
    order?: IntFilter<"Photo"> | number
    isCulled?: BoolFilter<"Photo"> | boolean
    loved?: BoolFilter<"Photo"> | boolean
    aiCaption?: StringNullableFilter<"Photo"> | string | null
    aiTags?: StringNullableListFilter<"Photo">
    faceCount?: IntFilter<"Photo"> | number
    thumbnailKey?: StringNullableFilter<"Photo"> | string | null
    previewKey?: StringNullableFilter<"Photo"> | string | null
    status?: StringFilter<"Photo"> | string
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    gallery?: XOR<GalleryScalarRelationFilter, GalleryWhereInput>
    usedAsCoverIn?: GalleryListRelationFilter
    albumPhotos?: AlbumPhotoListRelationFilter
  }

  export type PhotoOrderByWithRelationInput = {
    id?: SortOrder
    galleryId?: SortOrder
    s3Key?: SortOrder
    s3Bucket?: SortOrder
    originalFilename?: SortOrder
    originalSize?: SortOrder
    thumbnailSize?: SortOrder
    previewSize?: SortOrder
    totalSize?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    isCulled?: SortOrder
    loved?: SortOrder
    aiCaption?: SortOrderInput | SortOrder
    aiTags?: SortOrder
    faceCount?: SortOrder
    thumbnailKey?: SortOrderInput | SortOrder
    previewKey?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    gallery?: GalleryOrderByWithRelationInput
    usedAsCoverIn?: GalleryOrderByRelationAggregateInput
    albumPhotos?: AlbumPhotoOrderByRelationAggregateInput
  }

  export type PhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    galleryId?: StringFilter<"Photo"> | string
    s3Key?: StringFilter<"Photo"> | string
    s3Bucket?: StringFilter<"Photo"> | string
    originalFilename?: StringFilter<"Photo"> | string
    originalSize?: BigIntFilter<"Photo"> | bigint | number
    thumbnailSize?: BigIntFilter<"Photo"> | bigint | number
    previewSize?: BigIntFilter<"Photo"> | bigint | number
    totalSize?: BigIntFilter<"Photo"> | bigint | number
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    mimeType?: StringFilter<"Photo"> | string
    order?: IntFilter<"Photo"> | number
    isCulled?: BoolFilter<"Photo"> | boolean
    loved?: BoolFilter<"Photo"> | boolean
    aiCaption?: StringNullableFilter<"Photo"> | string | null
    aiTags?: StringNullableListFilter<"Photo">
    faceCount?: IntFilter<"Photo"> | number
    thumbnailKey?: StringNullableFilter<"Photo"> | string | null
    previewKey?: StringNullableFilter<"Photo"> | string | null
    status?: StringFilter<"Photo"> | string
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    gallery?: XOR<GalleryScalarRelationFilter, GalleryWhereInput>
    usedAsCoverIn?: GalleryListRelationFilter
    albumPhotos?: AlbumPhotoListRelationFilter
  }, "id" | "id">

  export type PhotoOrderByWithAggregationInput = {
    id?: SortOrder
    galleryId?: SortOrder
    s3Key?: SortOrder
    s3Bucket?: SortOrder
    originalFilename?: SortOrder
    originalSize?: SortOrder
    thumbnailSize?: SortOrder
    previewSize?: SortOrder
    totalSize?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    isCulled?: SortOrder
    loved?: SortOrder
    aiCaption?: SortOrderInput | SortOrder
    aiTags?: SortOrder
    faceCount?: SortOrder
    thumbnailKey?: SortOrderInput | SortOrder
    previewKey?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: PhotoCountOrderByAggregateInput
    _avg?: PhotoAvgOrderByAggregateInput
    _max?: PhotoMaxOrderByAggregateInput
    _min?: PhotoMinOrderByAggregateInput
    _sum?: PhotoSumOrderByAggregateInput
  }

  export type PhotoScalarWhereWithAggregatesInput = {
    AND?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    OR?: PhotoScalarWhereWithAggregatesInput[]
    NOT?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Photo"> | string
    galleryId?: StringWithAggregatesFilter<"Photo"> | string
    s3Key?: StringWithAggregatesFilter<"Photo"> | string
    s3Bucket?: StringWithAggregatesFilter<"Photo"> | string
    originalFilename?: StringWithAggregatesFilter<"Photo"> | string
    originalSize?: BigIntWithAggregatesFilter<"Photo"> | bigint | number
    thumbnailSize?: BigIntWithAggregatesFilter<"Photo"> | bigint | number
    previewSize?: BigIntWithAggregatesFilter<"Photo"> | bigint | number
    totalSize?: BigIntWithAggregatesFilter<"Photo"> | bigint | number
    width?: IntNullableWithAggregatesFilter<"Photo"> | number | null
    height?: IntNullableWithAggregatesFilter<"Photo"> | number | null
    mimeType?: StringWithAggregatesFilter<"Photo"> | string
    order?: IntWithAggregatesFilter<"Photo"> | number
    isCulled?: BoolWithAggregatesFilter<"Photo"> | boolean
    loved?: BoolWithAggregatesFilter<"Photo"> | boolean
    aiCaption?: StringNullableWithAggregatesFilter<"Photo"> | string | null
    aiTags?: StringNullableListFilter<"Photo">
    faceCount?: IntWithAggregatesFilter<"Photo"> | number
    thumbnailKey?: StringNullableWithAggregatesFilter<"Photo"> | string | null
    previewKey?: StringNullableWithAggregatesFilter<"Photo"> | string | null
    status?: StringWithAggregatesFilter<"Photo"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Photo"> | Date | string
  }

  export type StorageEventWhereInput = {
    AND?: StorageEventWhereInput | StorageEventWhereInput[]
    OR?: StorageEventWhereInput[]
    NOT?: StorageEventWhereInput | StorageEventWhereInput[]
    id?: StringFilter<"StorageEvent"> | string
    userId?: StringFilter<"StorageEvent"> | string
    photoId?: StringNullableFilter<"StorageEvent"> | string | null
    delta?: BigIntFilter<"StorageEvent"> | bigint | number
    reason?: StringFilter<"StorageEvent"> | string
    createdAt?: DateTimeFilter<"StorageEvent"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type StorageEventOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrderInput | SortOrder
    delta?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type StorageEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StorageEventWhereInput | StorageEventWhereInput[]
    OR?: StorageEventWhereInput[]
    NOT?: StorageEventWhereInput | StorageEventWhereInput[]
    userId?: StringFilter<"StorageEvent"> | string
    photoId?: StringNullableFilter<"StorageEvent"> | string | null
    delta?: BigIntFilter<"StorageEvent"> | bigint | number
    reason?: StringFilter<"StorageEvent"> | string
    createdAt?: DateTimeFilter<"StorageEvent"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type StorageEventOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrderInput | SortOrder
    delta?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
    _count?: StorageEventCountOrderByAggregateInput
    _avg?: StorageEventAvgOrderByAggregateInput
    _max?: StorageEventMaxOrderByAggregateInput
    _min?: StorageEventMinOrderByAggregateInput
    _sum?: StorageEventSumOrderByAggregateInput
  }

  export type StorageEventScalarWhereWithAggregatesInput = {
    AND?: StorageEventScalarWhereWithAggregatesInput | StorageEventScalarWhereWithAggregatesInput[]
    OR?: StorageEventScalarWhereWithAggregatesInput[]
    NOT?: StorageEventScalarWhereWithAggregatesInput | StorageEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StorageEvent"> | string
    userId?: StringWithAggregatesFilter<"StorageEvent"> | string
    photoId?: StringNullableWithAggregatesFilter<"StorageEvent"> | string | null
    delta?: BigIntWithAggregatesFilter<"StorageEvent"> | bigint | number
    reason?: StringWithAggregatesFilter<"StorageEvent"> | string
    createdAt?: DateTimeWithAggregatesFilter<"StorageEvent"> | Date | string
  }

  export type ClientWhereInput = {
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    id?: StringFilter<"Client"> | string
    userId?: StringFilter<"Client"> | string
    name?: StringFilter<"Client"> | string
    email?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    galleries?: GalleryClientListRelationFilter
  }

  export type ClientOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    galleries?: GalleryClientOrderByRelationAggregateInput
  }

  export type ClientWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_email?: ClientUserIdEmailCompoundUniqueInput
    AND?: ClientWhereInput | ClientWhereInput[]
    OR?: ClientWhereInput[]
    NOT?: ClientWhereInput | ClientWhereInput[]
    userId?: StringFilter<"Client"> | string
    name?: StringFilter<"Client"> | string
    email?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    galleries?: GalleryClientListRelationFilter
  }, "id" | "id" | "userId_email">

  export type ClientOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ClientCountOrderByAggregateInput
    _max?: ClientMaxOrderByAggregateInput
    _min?: ClientMinOrderByAggregateInput
  }

  export type ClientScalarWhereWithAggregatesInput = {
    AND?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    OR?: ClientScalarWhereWithAggregatesInput[]
    NOT?: ClientScalarWhereWithAggregatesInput | ClientScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Client"> | string
    userId?: StringWithAggregatesFilter<"Client"> | string
    name?: StringWithAggregatesFilter<"Client"> | string
    email?: StringWithAggregatesFilter<"Client"> | string
    phone?: StringNullableWithAggregatesFilter<"Client"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Client"> | Date | string
  }

  export type GalleryClientWhereInput = {
    AND?: GalleryClientWhereInput | GalleryClientWhereInput[]
    OR?: GalleryClientWhereInput[]
    NOT?: GalleryClientWhereInput | GalleryClientWhereInput[]
    galleryId?: StringFilter<"GalleryClient"> | string
    clientId?: StringFilter<"GalleryClient"> | string
    createdAt?: DateTimeFilter<"GalleryClient"> | Date | string
    gallery?: XOR<GalleryScalarRelationFilter, GalleryWhereInput>
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }

  export type GalleryClientOrderByWithRelationInput = {
    galleryId?: SortOrder
    clientId?: SortOrder
    createdAt?: SortOrder
    gallery?: GalleryOrderByWithRelationInput
    client?: ClientOrderByWithRelationInput
  }

  export type GalleryClientWhereUniqueInput = Prisma.AtLeast<{
    galleryId_clientId?: GalleryClientGalleryIdClientIdCompoundUniqueInput
    AND?: GalleryClientWhereInput | GalleryClientWhereInput[]
    OR?: GalleryClientWhereInput[]
    NOT?: GalleryClientWhereInput | GalleryClientWhereInput[]
    galleryId?: StringFilter<"GalleryClient"> | string
    clientId?: StringFilter<"GalleryClient"> | string
    createdAt?: DateTimeFilter<"GalleryClient"> | Date | string
    gallery?: XOR<GalleryScalarRelationFilter, GalleryWhereInput>
    client?: XOR<ClientScalarRelationFilter, ClientWhereInput>
  }, "galleryId_clientId">

  export type GalleryClientOrderByWithAggregationInput = {
    galleryId?: SortOrder
    clientId?: SortOrder
    createdAt?: SortOrder
    _count?: GalleryClientCountOrderByAggregateInput
    _max?: GalleryClientMaxOrderByAggregateInput
    _min?: GalleryClientMinOrderByAggregateInput
  }

  export type GalleryClientScalarWhereWithAggregatesInput = {
    AND?: GalleryClientScalarWhereWithAggregatesInput | GalleryClientScalarWhereWithAggregatesInput[]
    OR?: GalleryClientScalarWhereWithAggregatesInput[]
    NOT?: GalleryClientScalarWhereWithAggregatesInput | GalleryClientScalarWhereWithAggregatesInput[]
    galleryId?: StringWithAggregatesFilter<"GalleryClient"> | string
    clientId?: StringWithAggregatesFilter<"GalleryClient"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GalleryClient"> | Date | string
  }

  export type AlbumWhereInput = {
    AND?: AlbumWhereInput | AlbumWhereInput[]
    OR?: AlbumWhereInput[]
    NOT?: AlbumWhereInput | AlbumWhereInput[]
    id?: StringFilter<"Album"> | string
    galleryId?: StringFilter<"Album"> | string
    title?: StringFilter<"Album"> | string
    createdAt?: DateTimeFilter<"Album"> | Date | string
    updatedAt?: DateTimeFilter<"Album"> | Date | string
    gallery?: XOR<GalleryScalarRelationFilter, GalleryWhereInput>
    photos?: AlbumPhotoListRelationFilter
  }

  export type AlbumOrderByWithRelationInput = {
    id?: SortOrder
    galleryId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    gallery?: GalleryOrderByWithRelationInput
    photos?: AlbumPhotoOrderByRelationAggregateInput
  }

  export type AlbumWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AlbumWhereInput | AlbumWhereInput[]
    OR?: AlbumWhereInput[]
    NOT?: AlbumWhereInput | AlbumWhereInput[]
    galleryId?: StringFilter<"Album"> | string
    title?: StringFilter<"Album"> | string
    createdAt?: DateTimeFilter<"Album"> | Date | string
    updatedAt?: DateTimeFilter<"Album"> | Date | string
    gallery?: XOR<GalleryScalarRelationFilter, GalleryWhereInput>
    photos?: AlbumPhotoListRelationFilter
  }, "id" | "id">

  export type AlbumOrderByWithAggregationInput = {
    id?: SortOrder
    galleryId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AlbumCountOrderByAggregateInput
    _max?: AlbumMaxOrderByAggregateInput
    _min?: AlbumMinOrderByAggregateInput
  }

  export type AlbumScalarWhereWithAggregatesInput = {
    AND?: AlbumScalarWhereWithAggregatesInput | AlbumScalarWhereWithAggregatesInput[]
    OR?: AlbumScalarWhereWithAggregatesInput[]
    NOT?: AlbumScalarWhereWithAggregatesInput | AlbumScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Album"> | string
    galleryId?: StringWithAggregatesFilter<"Album"> | string
    title?: StringWithAggregatesFilter<"Album"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Album"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Album"> | Date | string
  }

  export type AlbumPhotoWhereInput = {
    AND?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    OR?: AlbumPhotoWhereInput[]
    NOT?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    albumId?: StringFilter<"AlbumPhoto"> | string
    photoId?: StringFilter<"AlbumPhoto"> | string
    createdAt?: DateTimeFilter<"AlbumPhoto"> | Date | string
    album?: XOR<AlbumScalarRelationFilter, AlbumWhereInput>
    photo?: XOR<PhotoScalarRelationFilter, PhotoWhereInput>
  }

  export type AlbumPhotoOrderByWithRelationInput = {
    albumId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
    album?: AlbumOrderByWithRelationInput
    photo?: PhotoOrderByWithRelationInput
  }

  export type AlbumPhotoWhereUniqueInput = Prisma.AtLeast<{
    albumId_photoId?: AlbumPhotoAlbumIdPhotoIdCompoundUniqueInput
    AND?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    OR?: AlbumPhotoWhereInput[]
    NOT?: AlbumPhotoWhereInput | AlbumPhotoWhereInput[]
    albumId?: StringFilter<"AlbumPhoto"> | string
    photoId?: StringFilter<"AlbumPhoto"> | string
    createdAt?: DateTimeFilter<"AlbumPhoto"> | Date | string
    album?: XOR<AlbumScalarRelationFilter, AlbumWhereInput>
    photo?: XOR<PhotoScalarRelationFilter, PhotoWhereInput>
  }, "albumId_photoId">

  export type AlbumPhotoOrderByWithAggregationInput = {
    albumId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
    _count?: AlbumPhotoCountOrderByAggregateInput
    _max?: AlbumPhotoMaxOrderByAggregateInput
    _min?: AlbumPhotoMinOrderByAggregateInput
  }

  export type AlbumPhotoScalarWhereWithAggregatesInput = {
    AND?: AlbumPhotoScalarWhereWithAggregatesInput | AlbumPhotoScalarWhereWithAggregatesInput[]
    OR?: AlbumPhotoScalarWhereWithAggregatesInput[]
    NOT?: AlbumPhotoScalarWhereWithAggregatesInput | AlbumPhotoScalarWhereWithAggregatesInput[]
    albumId?: StringWithAggregatesFilter<"AlbumPhoto"> | string
    photoId?: StringWithAggregatesFilter<"AlbumPhoto"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AlbumPhoto"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    payment?: PaymentCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingCreateNestedOneWithoutUserInput
    galleries?: GalleryCreateNestedManyWithoutUserInput
    clients?: ClientCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingUncheckedCreateNestedOneWithoutUserInput
    galleries?: GalleryUncheckedCreateNestedManyWithoutUserInput
    clients?: ClientUncheckedCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    payment?: PaymentUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUpdateOneWithoutUserNestedInput
    galleries?: GalleryUpdateManyWithoutUserNestedInput
    clients?: ClientUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUncheckedUpdateOneWithoutUserNestedInput
    galleries?: GalleryUncheckedUpdateManyWithoutUserNestedInput
    clients?: ClientUncheckedUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type SessionCreateInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    impersonatedBy?: string | null
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateManyInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    userId: string
    impersonatedBy?: string | null
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: StringFieldUpdateOperationsInput | string
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    accountId: string
    providerId: string
    userId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUncheckedCreateInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationCreateManyInput = {
    id?: string
    identifier: string
    value: string
    expiresAt: Date | string
    createdAt?: Date | string | null
    updatedAt?: Date | string | null
  }

  export type VerificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type VerificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    identifier?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentCreateInput = {
    planId: number
    plan: $Enums.PlanType
    planExpiresAt?: Date | string | null
    planStartedAt?: Date | string | null
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status: $Enums.SubscriptionStatus
    user: UserCreateNestedOneWithoutPaymentInput
  }

  export type PaymentUncheckedCreateInput = {
    id?: number
    planId: number
    plan: $Enums.PlanType
    planExpiresAt?: Date | string | null
    planStartedAt?: Date | string | null
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status: $Enums.SubscriptionStatus
    userId: string
  }

  export type PaymentUpdateInput = {
    planId?: IntFieldUpdateOperationsInput | number
    plan?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    planExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount_cents?: IntFieldUpdateOperationsInput | number
    transactionId?: IntFieldUpdateOperationsInput | number
    initial_transaction?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    user?: UserUpdateOneRequiredWithoutPaymentNestedInput
  }

  export type PaymentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    plan?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    planExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount_cents?: IntFieldUpdateOperationsInput | number
    transactionId?: IntFieldUpdateOperationsInput | number
    initial_transaction?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PaymentCreateManyInput = {
    id?: number
    planId: number
    plan: $Enums.PlanType
    planExpiresAt?: Date | string | null
    planStartedAt?: Date | string | null
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status: $Enums.SubscriptionStatus
    userId: string
  }

  export type PaymentUpdateManyMutationInput = {
    planId?: IntFieldUpdateOperationsInput | number
    plan?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    planExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount_cents?: IntFieldUpdateOperationsInput | number
    transactionId?: IntFieldUpdateOperationsInput | number
    initial_transaction?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
  }

  export type PaymentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    plan?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    planExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount_cents?: IntFieldUpdateOperationsInput | number
    transactionId?: IntFieldUpdateOperationsInput | number
    initial_transaction?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserOnboardingCreateInput = {
    userType: $Enums.UserType
    companyName?: string | null
    companySize?: string | null
    photographyType?: UserOnboardingCreatephotographyTypeInput | string[]
    photographyLevel?: $Enums.PhotographyLevel | null
    contactMethod?: $Enums.ContactMethod | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserOnboardingInput
  }

  export type UserOnboardingUncheckedCreateInput = {
    id?: number
    userId: string
    userType: $Enums.UserType
    companyName?: string | null
    companySize?: string | null
    photographyType?: UserOnboardingCreatephotographyTypeInput | string[]
    photographyLevel?: $Enums.PhotographyLevel | null
    contactMethod?: $Enums.ContactMethod | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserOnboardingUpdateInput = {
    userType?: EnumUserTypeFieldUpdateOperationsInput | $Enums.UserType
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    photographyType?: UserOnboardingUpdatephotographyTypeInput | string[]
    photographyLevel?: NullableEnumPhotographyLevelFieldUpdateOperationsInput | $Enums.PhotographyLevel | null
    contactMethod?: NullableEnumContactMethodFieldUpdateOperationsInput | $Enums.ContactMethod | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserOnboardingNestedInput
  }

  export type UserOnboardingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    userType?: EnumUserTypeFieldUpdateOperationsInput | $Enums.UserType
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    photographyType?: UserOnboardingUpdatephotographyTypeInput | string[]
    photographyLevel?: NullableEnumPhotographyLevelFieldUpdateOperationsInput | $Enums.PhotographyLevel | null
    contactMethod?: NullableEnumContactMethodFieldUpdateOperationsInput | $Enums.ContactMethod | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserOnboardingCreateManyInput = {
    id?: number
    userId: string
    userType: $Enums.UserType
    companyName?: string | null
    companySize?: string | null
    photographyType?: UserOnboardingCreatephotographyTypeInput | string[]
    photographyLevel?: $Enums.PhotographyLevel | null
    contactMethod?: $Enums.ContactMethod | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserOnboardingUpdateManyMutationInput = {
    userType?: EnumUserTypeFieldUpdateOperationsInput | $Enums.UserType
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    photographyType?: UserOnboardingUpdatephotographyTypeInput | string[]
    photographyLevel?: NullableEnumPhotographyLevelFieldUpdateOperationsInput | $Enums.PhotographyLevel | null
    contactMethod?: NullableEnumContactMethodFieldUpdateOperationsInput | $Enums.ContactMethod | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserOnboardingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    userType?: EnumUserTypeFieldUpdateOperationsInput | $Enums.UserType
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    photographyType?: UserOnboardingUpdatephotographyTypeInput | string[]
    photographyLevel?: NullableEnumPhotographyLevelFieldUpdateOperationsInput | $Enums.PhotographyLevel | null
    contactMethod?: NullableEnumContactMethodFieldUpdateOperationsInput | $Enums.ContactMethod | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryCreateInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGalleriesInput
    coverPhoto?: PhotoCreateNestedOneWithoutUsedAsCoverInInput
    photos?: PhotoCreateNestedManyWithoutGalleryInput
    albums?: AlbumCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientCreateNestedManyWithoutGalleryInput
  }

  export type GalleryUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    coverPhotoId?: string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutGalleryInput
    albums?: AlbumUncheckedCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientUncheckedCreateNestedManyWithoutGalleryInput
  }

  export type GalleryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGalleriesNestedInput
    coverPhoto?: PhotoUpdateOneWithoutUsedAsCoverInNestedInput
    photos?: PhotoUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coverPhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUncheckedUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUncheckedUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryCreateManyInput = {
    id?: string
    userId: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    coverPhotoId?: string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GalleryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coverPhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoCreateInput = {
    id?: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    gallery: GalleryCreateNestedOneWithoutPhotosInput
    usedAsCoverIn?: GalleryCreateNestedManyWithoutCoverPhotoInput
    albumPhotos?: AlbumPhotoCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUncheckedCreateInput = {
    id?: string
    galleryId: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    usedAsCoverIn?: GalleryUncheckedCreateNestedManyWithoutCoverPhotoInput
    albumPhotos?: AlbumPhotoUncheckedCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gallery?: GalleryUpdateOneRequiredWithoutPhotosNestedInput
    usedAsCoverIn?: GalleryUpdateManyWithoutCoverPhotoNestedInput
    albumPhotos?: AlbumPhotoUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    galleryId?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAsCoverIn?: GalleryUncheckedUpdateManyWithoutCoverPhotoNestedInput
    albumPhotos?: AlbumPhotoUncheckedUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoCreateManyInput = {
    id?: string
    galleryId: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type PhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    galleryId?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageEventCreateInput = {
    id?: string
    photoId?: string | null
    delta: bigint | number
    reason: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutStorageEventsInput
  }

  export type StorageEventUncheckedCreateInput = {
    id?: string
    userId: string
    photoId?: string | null
    delta: bigint | number
    reason: string
    createdAt?: Date | string
  }

  export type StorageEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: NullableStringFieldUpdateOperationsInput | string | null
    delta?: BigIntFieldUpdateOperationsInput | bigint | number
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStorageEventsNestedInput
  }

  export type StorageEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    photoId?: NullableStringFieldUpdateOperationsInput | string | null
    delta?: BigIntFieldUpdateOperationsInput | bigint | number
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageEventCreateManyInput = {
    id?: string
    userId: string
    photoId?: string | null
    delta: bigint | number
    reason: string
    createdAt?: Date | string
  }

  export type StorageEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: NullableStringFieldUpdateOperationsInput | string | null
    delta?: BigIntFieldUpdateOperationsInput | bigint | number
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    photoId?: NullableStringFieldUpdateOperationsInput | string | null
    delta?: BigIntFieldUpdateOperationsInput | bigint | number
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientsInput
    galleries?: GalleryClientCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    galleries?: GalleryClientUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientsNestedInput
    galleries?: GalleryClientUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    galleries?: GalleryClientUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientCreateManyInput = {
    id?: string
    userId: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryClientCreateInput = {
    createdAt?: Date | string
    gallery: GalleryCreateNestedOneWithoutClientsInput
    client: ClientCreateNestedOneWithoutGalleriesInput
  }

  export type GalleryClientUncheckedCreateInput = {
    galleryId: string
    clientId: string
    createdAt?: Date | string
  }

  export type GalleryClientUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gallery?: GalleryUpdateOneRequiredWithoutClientsNestedInput
    client?: ClientUpdateOneRequiredWithoutGalleriesNestedInput
  }

  export type GalleryClientUncheckedUpdateInput = {
    galleryId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryClientCreateManyInput = {
    galleryId: string
    clientId: string
    createdAt?: Date | string
  }

  export type GalleryClientUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryClientUncheckedUpdateManyInput = {
    galleryId?: StringFieldUpdateOperationsInput | string
    clientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumCreateInput = {
    id?: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gallery: GalleryCreateNestedOneWithoutAlbumsInput
    photos?: AlbumPhotoCreateNestedManyWithoutAlbumInput
  }

  export type AlbumUncheckedCreateInput = {
    id?: string
    galleryId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: AlbumPhotoUncheckedCreateNestedManyWithoutAlbumInput
  }

  export type AlbumUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gallery?: GalleryUpdateOneRequiredWithoutAlbumsNestedInput
    photos?: AlbumPhotoUpdateManyWithoutAlbumNestedInput
  }

  export type AlbumUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    galleryId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: AlbumPhotoUncheckedUpdateManyWithoutAlbumNestedInput
  }

  export type AlbumCreateManyInput = {
    id?: string
    galleryId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlbumUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    galleryId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoCreateInput = {
    createdAt?: Date | string
    album: AlbumCreateNestedOneWithoutPhotosInput
    photo: PhotoCreateNestedOneWithoutAlbumPhotosInput
  }

  export type AlbumPhotoUncheckedCreateInput = {
    albumId: string
    photoId: string
    createdAt?: Date | string
  }

  export type AlbumPhotoUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    album?: AlbumUpdateOneRequiredWithoutPhotosNestedInput
    photo?: PhotoUpdateOneRequiredWithoutAlbumPhotosNestedInput
  }

  export type AlbumPhotoUncheckedUpdateInput = {
    albumId?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoCreateManyInput = {
    albumId: string
    photoId: string
    createdAt?: Date | string
  }

  export type AlbumPhotoUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoUncheckedUpdateManyInput = {
    albumId?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumPlanFilter<$PrismaModel = never> = {
    equals?: $Enums.Plan | EnumPlanFieldRefInput<$PrismaModel>
    in?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanFilter<$PrismaModel> | $Enums.Plan
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type PaymentListRelationFilter = {
    every?: PaymentWhereInput
    some?: PaymentWhereInput
    none?: PaymentWhereInput
  }

  export type UserOnboardingNullableScalarRelationFilter = {
    is?: UserOnboardingWhereInput | null
    isNot?: UserOnboardingWhereInput | null
  }

  export type GalleryListRelationFilter = {
    every?: GalleryWhereInput
    some?: GalleryWhereInput
    none?: GalleryWhereInput
  }

  export type ClientListRelationFilter = {
    every?: ClientWhereInput
    some?: ClientWhereInput
    none?: ClientWhereInput
  }

  export type StorageEventListRelationFilter = {
    every?: StorageEventWhereInput
    some?: StorageEventWhereInput
    none?: StorageEventWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GalleryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ClientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StorageEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    storageUsed?: SortOrder
    storageLimit?: SortOrder
    overageBytes?: SortOrder
    overageResetAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    warningEmailSent80?: SortOrder
    warningEmailSent95?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    subscribed?: SortOrder
    finishOnboarding?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    storageUsed?: SortOrder
    storageLimit?: SortOrder
    overageBytes?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    storageUsed?: SortOrder
    storageLimit?: SortOrder
    overageBytes?: SortOrder
    overageResetAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    warningEmailSent80?: SortOrder
    warningEmailSent95?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    subscribed?: SortOrder
    finishOnboarding?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    plan?: SortOrder
    storageUsed?: SortOrder
    storageLimit?: SortOrder
    overageBytes?: SortOrder
    overageResetAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubId?: SortOrder
    warningEmailSent80?: SortOrder
    warningEmailSent95?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    role?: SortOrder
    banned?: SortOrder
    banReason?: SortOrder
    banExpires?: SortOrder
    subscribed?: SortOrder
    finishOnboarding?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    storageUsed?: SortOrder
    storageLimit?: SortOrder
    overageBytes?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumPlanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Plan | EnumPlanFieldRefInput<$PrismaModel>
    in?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanWithAggregatesFilter<$PrismaModel> | $Enums.Plan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanFilter<$PrismaModel>
    _max?: NestedEnumPlanFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    expiresAt?: SortOrder
    token?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    userId?: SortOrder
    impersonatedBy?: SortOrder
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    accountId?: SortOrder
    providerId?: SortOrder
    userId?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    idToken?: SortOrder
    accessTokenExpiresAt?: SortOrder
    refreshTokenExpiresAt?: SortOrder
    scope?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationCountOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMaxOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type VerificationMinOrderByAggregateInput = {
    id?: SortOrder
    identifier?: SortOrder
    value?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type PaymentCountOrderByAggregateInput = {
    id?: SortOrder
    planId?: SortOrder
    plan?: SortOrder
    planExpiresAt?: SortOrder
    planStartedAt?: SortOrder
    amount_cents?: SortOrder
    transactionId?: SortOrder
    initial_transaction?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
  }

  export type PaymentAvgOrderByAggregateInput = {
    id?: SortOrder
    planId?: SortOrder
    amount_cents?: SortOrder
    transactionId?: SortOrder
    initial_transaction?: SortOrder
    subscriptionId?: SortOrder
  }

  export type PaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    planId?: SortOrder
    plan?: SortOrder
    planExpiresAt?: SortOrder
    planStartedAt?: SortOrder
    amount_cents?: SortOrder
    transactionId?: SortOrder
    initial_transaction?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
  }

  export type PaymentMinOrderByAggregateInput = {
    id?: SortOrder
    planId?: SortOrder
    plan?: SortOrder
    planExpiresAt?: SortOrder
    planStartedAt?: SortOrder
    amount_cents?: SortOrder
    transactionId?: SortOrder
    initial_transaction?: SortOrder
    subscriptionId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    status?: SortOrder
    userId?: SortOrder
  }

  export type PaymentSumOrderByAggregateInput = {
    id?: SortOrder
    planId?: SortOrder
    amount_cents?: SortOrder
    transactionId?: SortOrder
    initial_transaction?: SortOrder
    subscriptionId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type EnumUserTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UserType | EnumUserTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeFilter<$PrismaModel> | $Enums.UserType
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumPhotographyLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PhotographyLevel | EnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPhotographyLevelNullableFilter<$PrismaModel> | $Enums.PhotographyLevel | null
  }

  export type EnumContactMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactMethod | EnumContactMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContactMethodNullableFilter<$PrismaModel> | $Enums.ContactMethod | null
  }

  export type UserOnboardingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userType?: SortOrder
    companyName?: SortOrder
    companySize?: SortOrder
    photographyType?: SortOrder
    photographyLevel?: SortOrder
    contactMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserOnboardingAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserOnboardingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userType?: SortOrder
    companyName?: SortOrder
    companySize?: SortOrder
    photographyLevel?: SortOrder
    contactMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserOnboardingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    userType?: SortOrder
    companyName?: SortOrder
    companySize?: SortOrder
    photographyLevel?: SortOrder
    contactMethod?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserOnboardingSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumUserTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserType | EnumUserTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeWithAggregatesFilter<$PrismaModel> | $Enums.UserType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserTypeFilter<$PrismaModel>
    _max?: NestedEnumUserTypeFilter<$PrismaModel>
  }

  export type EnumPhotographyLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhotographyLevel | EnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPhotographyLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.PhotographyLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPhotographyLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumPhotographyLevelNullableFilter<$PrismaModel>
  }

  export type EnumContactMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactMethod | EnumContactMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContactMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.ContactMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumContactMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumContactMethodNullableFilter<$PrismaModel>
  }

  export type PhotoNullableScalarRelationFilter = {
    is?: PhotoWhereInput | null
    isNot?: PhotoWhereInput | null
  }

  export type PhotoListRelationFilter = {
    every?: PhotoWhereInput
    some?: PhotoWhereInput
    none?: PhotoWhereInput
  }

  export type AlbumListRelationFilter = {
    every?: AlbumWhereInput
    some?: AlbumWhereInput
    none?: AlbumWhereInput
  }

  export type GalleryClientListRelationFilter = {
    every?: GalleryClientWhereInput
    some?: GalleryClientWhereInput
    none?: GalleryClientWhereInput
  }

  export type PhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AlbumOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GalleryClientOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GalleryUserIdSlugCompoundUniqueInput = {
    userId: string
    slug: string
  }

  export type GalleryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    eventDate?: SortOrder
    deadline?: SortOrder
    coverPhotoId?: SortOrder
    passwordHash?: SortOrder
    shareToken?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GalleryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    eventDate?: SortOrder
    deadline?: SortOrder
    coverPhotoId?: SortOrder
    passwordHash?: SortOrder
    shareToken?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GalleryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    eventDate?: SortOrder
    deadline?: SortOrder
    coverPhotoId?: SortOrder
    passwordHash?: SortOrder
    shareToken?: SortOrder
    isPublished?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type GalleryScalarRelationFilter = {
    is?: GalleryWhereInput
    isNot?: GalleryWhereInput
  }

  export type AlbumPhotoListRelationFilter = {
    every?: AlbumPhotoWhereInput
    some?: AlbumPhotoWhereInput
    none?: AlbumPhotoWhereInput
  }

  export type AlbumPhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PhotoCountOrderByAggregateInput = {
    id?: SortOrder
    galleryId?: SortOrder
    s3Key?: SortOrder
    s3Bucket?: SortOrder
    originalFilename?: SortOrder
    originalSize?: SortOrder
    thumbnailSize?: SortOrder
    previewSize?: SortOrder
    totalSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    isCulled?: SortOrder
    loved?: SortOrder
    aiCaption?: SortOrder
    aiTags?: SortOrder
    faceCount?: SortOrder
    thumbnailKey?: SortOrder
    previewKey?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoAvgOrderByAggregateInput = {
    originalSize?: SortOrder
    thumbnailSize?: SortOrder
    previewSize?: SortOrder
    totalSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
    order?: SortOrder
    faceCount?: SortOrder
  }

  export type PhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    galleryId?: SortOrder
    s3Key?: SortOrder
    s3Bucket?: SortOrder
    originalFilename?: SortOrder
    originalSize?: SortOrder
    thumbnailSize?: SortOrder
    previewSize?: SortOrder
    totalSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    isCulled?: SortOrder
    loved?: SortOrder
    aiCaption?: SortOrder
    faceCount?: SortOrder
    thumbnailKey?: SortOrder
    previewKey?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoMinOrderByAggregateInput = {
    id?: SortOrder
    galleryId?: SortOrder
    s3Key?: SortOrder
    s3Bucket?: SortOrder
    originalFilename?: SortOrder
    originalSize?: SortOrder
    thumbnailSize?: SortOrder
    previewSize?: SortOrder
    totalSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
    mimeType?: SortOrder
    order?: SortOrder
    isCulled?: SortOrder
    loved?: SortOrder
    aiCaption?: SortOrder
    faceCount?: SortOrder
    thumbnailKey?: SortOrder
    previewKey?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoSumOrderByAggregateInput = {
    originalSize?: SortOrder
    thumbnailSize?: SortOrder
    previewSize?: SortOrder
    totalSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
    order?: SortOrder
    faceCount?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type StorageEventCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageEventAvgOrderByAggregateInput = {
    delta?: SortOrder
  }

  export type StorageEventMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageEventMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    photoId?: SortOrder
    delta?: SortOrder
    reason?: SortOrder
    createdAt?: SortOrder
  }

  export type StorageEventSumOrderByAggregateInput = {
    delta?: SortOrder
  }

  export type ClientUserIdEmailCompoundUniqueInput = {
    userId: string
    email: string
  }

  export type ClientCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ClientScalarRelationFilter = {
    is?: ClientWhereInput
    isNot?: ClientWhereInput
  }

  export type GalleryClientGalleryIdClientIdCompoundUniqueInput = {
    galleryId: string
    clientId: string
  }

  export type GalleryClientCountOrderByAggregateInput = {
    galleryId?: SortOrder
    clientId?: SortOrder
    createdAt?: SortOrder
  }

  export type GalleryClientMaxOrderByAggregateInput = {
    galleryId?: SortOrder
    clientId?: SortOrder
    createdAt?: SortOrder
  }

  export type GalleryClientMinOrderByAggregateInput = {
    galleryId?: SortOrder
    clientId?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumCountOrderByAggregateInput = {
    id?: SortOrder
    galleryId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlbumMaxOrderByAggregateInput = {
    id?: SortOrder
    galleryId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlbumMinOrderByAggregateInput = {
    id?: SortOrder
    galleryId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AlbumScalarRelationFilter = {
    is?: AlbumWhereInput
    isNot?: AlbumWhereInput
  }

  export type PhotoScalarRelationFilter = {
    is?: PhotoWhereInput
    isNot?: PhotoWhereInput
  }

  export type AlbumPhotoAlbumIdPhotoIdCompoundUniqueInput = {
    albumId: string
    photoId: string
  }

  export type AlbumPhotoCountOrderByAggregateInput = {
    albumId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumPhotoMaxOrderByAggregateInput = {
    albumId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
  }

  export type AlbumPhotoMinOrderByAggregateInput = {
    albumId?: SortOrder
    photoId?: SortOrder
    createdAt?: SortOrder
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type PaymentCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type UserOnboardingCreateNestedOneWithoutUserInput = {
    create?: XOR<UserOnboardingCreateWithoutUserInput, UserOnboardingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserOnboardingCreateOrConnectWithoutUserInput
    connect?: UserOnboardingWhereUniqueInput
  }

  export type GalleryCreateNestedManyWithoutUserInput = {
    create?: XOR<GalleryCreateWithoutUserInput, GalleryUncheckedCreateWithoutUserInput> | GalleryCreateWithoutUserInput[] | GalleryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutUserInput | GalleryCreateOrConnectWithoutUserInput[]
    createMany?: GalleryCreateManyUserInputEnvelope
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
  }

  export type ClientCreateNestedManyWithoutUserInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput> | ClientCreateWithoutUserInput[] | ClientUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput | ClientCreateOrConnectWithoutUserInput[]
    createMany?: ClientCreateManyUserInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type StorageEventCreateNestedManyWithoutUserInput = {
    create?: XOR<StorageEventCreateWithoutUserInput, StorageEventUncheckedCreateWithoutUserInput> | StorageEventCreateWithoutUserInput[] | StorageEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StorageEventCreateOrConnectWithoutUserInput | StorageEventCreateOrConnectWithoutUserInput[]
    createMany?: StorageEventCreateManyUserInputEnvelope
    connect?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type PaymentUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
  }

  export type UserOnboardingUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserOnboardingCreateWithoutUserInput, UserOnboardingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserOnboardingCreateOrConnectWithoutUserInput
    connect?: UserOnboardingWhereUniqueInput
  }

  export type GalleryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GalleryCreateWithoutUserInput, GalleryUncheckedCreateWithoutUserInput> | GalleryCreateWithoutUserInput[] | GalleryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutUserInput | GalleryCreateOrConnectWithoutUserInput[]
    createMany?: GalleryCreateManyUserInputEnvelope
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
  }

  export type ClientUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput> | ClientCreateWithoutUserInput[] | ClientUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput | ClientCreateOrConnectWithoutUserInput[]
    createMany?: ClientCreateManyUserInputEnvelope
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
  }

  export type StorageEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<StorageEventCreateWithoutUserInput, StorageEventUncheckedCreateWithoutUserInput> | StorageEventCreateWithoutUserInput[] | StorageEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StorageEventCreateOrConnectWithoutUserInput | StorageEventCreateOrConnectWithoutUserInput[]
    createMany?: StorageEventCreateManyUserInputEnvelope
    connect?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumPlanFieldUpdateOperationsInput = {
    set?: $Enums.Plan
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type PaymentUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type UserOnboardingUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserOnboardingCreateWithoutUserInput, UserOnboardingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserOnboardingCreateOrConnectWithoutUserInput
    upsert?: UserOnboardingUpsertWithoutUserInput
    disconnect?: UserOnboardingWhereInput | boolean
    delete?: UserOnboardingWhereInput | boolean
    connect?: UserOnboardingWhereUniqueInput
    update?: XOR<XOR<UserOnboardingUpdateToOneWithWhereWithoutUserInput, UserOnboardingUpdateWithoutUserInput>, UserOnboardingUncheckedUpdateWithoutUserInput>
  }

  export type GalleryUpdateManyWithoutUserNestedInput = {
    create?: XOR<GalleryCreateWithoutUserInput, GalleryUncheckedCreateWithoutUserInput> | GalleryCreateWithoutUserInput[] | GalleryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutUserInput | GalleryCreateOrConnectWithoutUserInput[]
    upsert?: GalleryUpsertWithWhereUniqueWithoutUserInput | GalleryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GalleryCreateManyUserInputEnvelope
    set?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    disconnect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    delete?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    update?: GalleryUpdateWithWhereUniqueWithoutUserInput | GalleryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GalleryUpdateManyWithWhereWithoutUserInput | GalleryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GalleryScalarWhereInput | GalleryScalarWhereInput[]
  }

  export type ClientUpdateManyWithoutUserNestedInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput> | ClientCreateWithoutUserInput[] | ClientUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput | ClientCreateOrConnectWithoutUserInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutUserInput | ClientUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ClientCreateManyUserInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutUserInput | ClientUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutUserInput | ClientUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type StorageEventUpdateManyWithoutUserNestedInput = {
    create?: XOR<StorageEventCreateWithoutUserInput, StorageEventUncheckedCreateWithoutUserInput> | StorageEventCreateWithoutUserInput[] | StorageEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StorageEventCreateOrConnectWithoutUserInput | StorageEventCreateOrConnectWithoutUserInput[]
    upsert?: StorageEventUpsertWithWhereUniqueWithoutUserInput | StorageEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: StorageEventCreateManyUserInputEnvelope
    set?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    disconnect?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    delete?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    connect?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    update?: StorageEventUpdateWithWhereUniqueWithoutUserInput | StorageEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: StorageEventUpdateManyWithWhereWithoutUserInput | StorageEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: StorageEventScalarWhereInput | StorageEventScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type PaymentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput> | PaymentCreateWithoutUserInput[] | PaymentUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PaymentCreateOrConnectWithoutUserInput | PaymentCreateOrConnectWithoutUserInput[]
    upsert?: PaymentUpsertWithWhereUniqueWithoutUserInput | PaymentUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PaymentCreateManyUserInputEnvelope
    set?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    disconnect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    delete?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    connect?: PaymentWhereUniqueInput | PaymentWhereUniqueInput[]
    update?: PaymentUpdateWithWhereUniqueWithoutUserInput | PaymentUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PaymentUpdateManyWithWhereWithoutUserInput | PaymentUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
  }

  export type UserOnboardingUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserOnboardingCreateWithoutUserInput, UserOnboardingUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserOnboardingCreateOrConnectWithoutUserInput
    upsert?: UserOnboardingUpsertWithoutUserInput
    disconnect?: UserOnboardingWhereInput | boolean
    delete?: UserOnboardingWhereInput | boolean
    connect?: UserOnboardingWhereUniqueInput
    update?: XOR<XOR<UserOnboardingUpdateToOneWithWhereWithoutUserInput, UserOnboardingUpdateWithoutUserInput>, UserOnboardingUncheckedUpdateWithoutUserInput>
  }

  export type GalleryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GalleryCreateWithoutUserInput, GalleryUncheckedCreateWithoutUserInput> | GalleryCreateWithoutUserInput[] | GalleryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutUserInput | GalleryCreateOrConnectWithoutUserInput[]
    upsert?: GalleryUpsertWithWhereUniqueWithoutUserInput | GalleryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GalleryCreateManyUserInputEnvelope
    set?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    disconnect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    delete?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    update?: GalleryUpdateWithWhereUniqueWithoutUserInput | GalleryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GalleryUpdateManyWithWhereWithoutUserInput | GalleryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GalleryScalarWhereInput | GalleryScalarWhereInput[]
  }

  export type ClientUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput> | ClientCreateWithoutUserInput[] | ClientUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ClientCreateOrConnectWithoutUserInput | ClientCreateOrConnectWithoutUserInput[]
    upsert?: ClientUpsertWithWhereUniqueWithoutUserInput | ClientUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ClientCreateManyUserInputEnvelope
    set?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    disconnect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    delete?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    connect?: ClientWhereUniqueInput | ClientWhereUniqueInput[]
    update?: ClientUpdateWithWhereUniqueWithoutUserInput | ClientUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ClientUpdateManyWithWhereWithoutUserInput | ClientUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ClientScalarWhereInput | ClientScalarWhereInput[]
  }

  export type StorageEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<StorageEventCreateWithoutUserInput, StorageEventUncheckedCreateWithoutUserInput> | StorageEventCreateWithoutUserInput[] | StorageEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: StorageEventCreateOrConnectWithoutUserInput | StorageEventCreateOrConnectWithoutUserInput[]
    upsert?: StorageEventUpsertWithWhereUniqueWithoutUserInput | StorageEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: StorageEventCreateManyUserInputEnvelope
    set?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    disconnect?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    delete?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    connect?: StorageEventWhereUniqueInput | StorageEventWhereUniqueInput[]
    update?: StorageEventUpdateWithWhereUniqueWithoutUserInput | StorageEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: StorageEventUpdateManyWithWhereWithoutUserInput | StorageEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: StorageEventScalarWhereInput | StorageEventScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutPaymentInput = {
    create?: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumPlanTypeFieldUpdateOperationsInput = {
    set?: $Enums.PlanType
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type UserUpdateOneRequiredWithoutPaymentNestedInput = {
    create?: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentInput
    upsert?: UserUpsertWithoutPaymentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPaymentInput, UserUpdateWithoutPaymentInput>, UserUncheckedUpdateWithoutPaymentInput>
  }

  export type UserOnboardingCreatephotographyTypeInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutUserOnboardingInput = {
    create?: XOR<UserCreateWithoutUserOnboardingInput, UserUncheckedCreateWithoutUserOnboardingInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserOnboardingInput
    connect?: UserWhereUniqueInput
  }

  export type EnumUserTypeFieldUpdateOperationsInput = {
    set?: $Enums.UserType
  }

  export type UserOnboardingUpdatephotographyTypeInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableEnumPhotographyLevelFieldUpdateOperationsInput = {
    set?: $Enums.PhotographyLevel | null
  }

  export type NullableEnumContactMethodFieldUpdateOperationsInput = {
    set?: $Enums.ContactMethod | null
  }

  export type UserUpdateOneRequiredWithoutUserOnboardingNestedInput = {
    create?: XOR<UserCreateWithoutUserOnboardingInput, UserUncheckedCreateWithoutUserOnboardingInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserOnboardingInput
    upsert?: UserUpsertWithoutUserOnboardingInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserOnboardingInput, UserUpdateWithoutUserOnboardingInput>, UserUncheckedUpdateWithoutUserOnboardingInput>
  }

  export type UserCreateNestedOneWithoutGalleriesInput = {
    create?: XOR<UserCreateWithoutGalleriesInput, UserUncheckedCreateWithoutGalleriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutGalleriesInput
    connect?: UserWhereUniqueInput
  }

  export type PhotoCreateNestedOneWithoutUsedAsCoverInInput = {
    create?: XOR<PhotoCreateWithoutUsedAsCoverInInput, PhotoUncheckedCreateWithoutUsedAsCoverInInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutUsedAsCoverInInput
    connect?: PhotoWhereUniqueInput
  }

  export type PhotoCreateNestedManyWithoutGalleryInput = {
    create?: XOR<PhotoCreateWithoutGalleryInput, PhotoUncheckedCreateWithoutGalleryInput> | PhotoCreateWithoutGalleryInput[] | PhotoUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutGalleryInput | PhotoCreateOrConnectWithoutGalleryInput[]
    createMany?: PhotoCreateManyGalleryInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type AlbumCreateNestedManyWithoutGalleryInput = {
    create?: XOR<AlbumCreateWithoutGalleryInput, AlbumUncheckedCreateWithoutGalleryInput> | AlbumCreateWithoutGalleryInput[] | AlbumUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: AlbumCreateOrConnectWithoutGalleryInput | AlbumCreateOrConnectWithoutGalleryInput[]
    createMany?: AlbumCreateManyGalleryInputEnvelope
    connect?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
  }

  export type GalleryClientCreateNestedManyWithoutGalleryInput = {
    create?: XOR<GalleryClientCreateWithoutGalleryInput, GalleryClientUncheckedCreateWithoutGalleryInput> | GalleryClientCreateWithoutGalleryInput[] | GalleryClientUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutGalleryInput | GalleryClientCreateOrConnectWithoutGalleryInput[]
    createMany?: GalleryClientCreateManyGalleryInputEnvelope
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
  }

  export type PhotoUncheckedCreateNestedManyWithoutGalleryInput = {
    create?: XOR<PhotoCreateWithoutGalleryInput, PhotoUncheckedCreateWithoutGalleryInput> | PhotoCreateWithoutGalleryInput[] | PhotoUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutGalleryInput | PhotoCreateOrConnectWithoutGalleryInput[]
    createMany?: PhotoCreateManyGalleryInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type AlbumUncheckedCreateNestedManyWithoutGalleryInput = {
    create?: XOR<AlbumCreateWithoutGalleryInput, AlbumUncheckedCreateWithoutGalleryInput> | AlbumCreateWithoutGalleryInput[] | AlbumUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: AlbumCreateOrConnectWithoutGalleryInput | AlbumCreateOrConnectWithoutGalleryInput[]
    createMany?: AlbumCreateManyGalleryInputEnvelope
    connect?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
  }

  export type GalleryClientUncheckedCreateNestedManyWithoutGalleryInput = {
    create?: XOR<GalleryClientCreateWithoutGalleryInput, GalleryClientUncheckedCreateWithoutGalleryInput> | GalleryClientCreateWithoutGalleryInput[] | GalleryClientUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutGalleryInput | GalleryClientCreateOrConnectWithoutGalleryInput[]
    createMany?: GalleryClientCreateManyGalleryInputEnvelope
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutGalleriesNestedInput = {
    create?: XOR<UserCreateWithoutGalleriesInput, UserUncheckedCreateWithoutGalleriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutGalleriesInput
    upsert?: UserUpsertWithoutGalleriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGalleriesInput, UserUpdateWithoutGalleriesInput>, UserUncheckedUpdateWithoutGalleriesInput>
  }

  export type PhotoUpdateOneWithoutUsedAsCoverInNestedInput = {
    create?: XOR<PhotoCreateWithoutUsedAsCoverInInput, PhotoUncheckedCreateWithoutUsedAsCoverInInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutUsedAsCoverInInput
    upsert?: PhotoUpsertWithoutUsedAsCoverInInput
    disconnect?: PhotoWhereInput | boolean
    delete?: PhotoWhereInput | boolean
    connect?: PhotoWhereUniqueInput
    update?: XOR<XOR<PhotoUpdateToOneWithWhereWithoutUsedAsCoverInInput, PhotoUpdateWithoutUsedAsCoverInInput>, PhotoUncheckedUpdateWithoutUsedAsCoverInInput>
  }

  export type PhotoUpdateManyWithoutGalleryNestedInput = {
    create?: XOR<PhotoCreateWithoutGalleryInput, PhotoUncheckedCreateWithoutGalleryInput> | PhotoCreateWithoutGalleryInput[] | PhotoUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutGalleryInput | PhotoCreateOrConnectWithoutGalleryInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutGalleryInput | PhotoUpsertWithWhereUniqueWithoutGalleryInput[]
    createMany?: PhotoCreateManyGalleryInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutGalleryInput | PhotoUpdateWithWhereUniqueWithoutGalleryInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutGalleryInput | PhotoUpdateManyWithWhereWithoutGalleryInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type AlbumUpdateManyWithoutGalleryNestedInput = {
    create?: XOR<AlbumCreateWithoutGalleryInput, AlbumUncheckedCreateWithoutGalleryInput> | AlbumCreateWithoutGalleryInput[] | AlbumUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: AlbumCreateOrConnectWithoutGalleryInput | AlbumCreateOrConnectWithoutGalleryInput[]
    upsert?: AlbumUpsertWithWhereUniqueWithoutGalleryInput | AlbumUpsertWithWhereUniqueWithoutGalleryInput[]
    createMany?: AlbumCreateManyGalleryInputEnvelope
    set?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    disconnect?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    delete?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    connect?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    update?: AlbumUpdateWithWhereUniqueWithoutGalleryInput | AlbumUpdateWithWhereUniqueWithoutGalleryInput[]
    updateMany?: AlbumUpdateManyWithWhereWithoutGalleryInput | AlbumUpdateManyWithWhereWithoutGalleryInput[]
    deleteMany?: AlbumScalarWhereInput | AlbumScalarWhereInput[]
  }

  export type GalleryClientUpdateManyWithoutGalleryNestedInput = {
    create?: XOR<GalleryClientCreateWithoutGalleryInput, GalleryClientUncheckedCreateWithoutGalleryInput> | GalleryClientCreateWithoutGalleryInput[] | GalleryClientUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutGalleryInput | GalleryClientCreateOrConnectWithoutGalleryInput[]
    upsert?: GalleryClientUpsertWithWhereUniqueWithoutGalleryInput | GalleryClientUpsertWithWhereUniqueWithoutGalleryInput[]
    createMany?: GalleryClientCreateManyGalleryInputEnvelope
    set?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    disconnect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    delete?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    update?: GalleryClientUpdateWithWhereUniqueWithoutGalleryInput | GalleryClientUpdateWithWhereUniqueWithoutGalleryInput[]
    updateMany?: GalleryClientUpdateManyWithWhereWithoutGalleryInput | GalleryClientUpdateManyWithWhereWithoutGalleryInput[]
    deleteMany?: GalleryClientScalarWhereInput | GalleryClientScalarWhereInput[]
  }

  export type PhotoUncheckedUpdateManyWithoutGalleryNestedInput = {
    create?: XOR<PhotoCreateWithoutGalleryInput, PhotoUncheckedCreateWithoutGalleryInput> | PhotoCreateWithoutGalleryInput[] | PhotoUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutGalleryInput | PhotoCreateOrConnectWithoutGalleryInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutGalleryInput | PhotoUpsertWithWhereUniqueWithoutGalleryInput[]
    createMany?: PhotoCreateManyGalleryInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutGalleryInput | PhotoUpdateWithWhereUniqueWithoutGalleryInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutGalleryInput | PhotoUpdateManyWithWhereWithoutGalleryInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type AlbumUncheckedUpdateManyWithoutGalleryNestedInput = {
    create?: XOR<AlbumCreateWithoutGalleryInput, AlbumUncheckedCreateWithoutGalleryInput> | AlbumCreateWithoutGalleryInput[] | AlbumUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: AlbumCreateOrConnectWithoutGalleryInput | AlbumCreateOrConnectWithoutGalleryInput[]
    upsert?: AlbumUpsertWithWhereUniqueWithoutGalleryInput | AlbumUpsertWithWhereUniqueWithoutGalleryInput[]
    createMany?: AlbumCreateManyGalleryInputEnvelope
    set?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    disconnect?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    delete?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    connect?: AlbumWhereUniqueInput | AlbumWhereUniqueInput[]
    update?: AlbumUpdateWithWhereUniqueWithoutGalleryInput | AlbumUpdateWithWhereUniqueWithoutGalleryInput[]
    updateMany?: AlbumUpdateManyWithWhereWithoutGalleryInput | AlbumUpdateManyWithWhereWithoutGalleryInput[]
    deleteMany?: AlbumScalarWhereInput | AlbumScalarWhereInput[]
  }

  export type GalleryClientUncheckedUpdateManyWithoutGalleryNestedInput = {
    create?: XOR<GalleryClientCreateWithoutGalleryInput, GalleryClientUncheckedCreateWithoutGalleryInput> | GalleryClientCreateWithoutGalleryInput[] | GalleryClientUncheckedCreateWithoutGalleryInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutGalleryInput | GalleryClientCreateOrConnectWithoutGalleryInput[]
    upsert?: GalleryClientUpsertWithWhereUniqueWithoutGalleryInput | GalleryClientUpsertWithWhereUniqueWithoutGalleryInput[]
    createMany?: GalleryClientCreateManyGalleryInputEnvelope
    set?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    disconnect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    delete?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    update?: GalleryClientUpdateWithWhereUniqueWithoutGalleryInput | GalleryClientUpdateWithWhereUniqueWithoutGalleryInput[]
    updateMany?: GalleryClientUpdateManyWithWhereWithoutGalleryInput | GalleryClientUpdateManyWithWhereWithoutGalleryInput[]
    deleteMany?: GalleryClientScalarWhereInput | GalleryClientScalarWhereInput[]
  }

  export type PhotoCreateaiTagsInput = {
    set: string[]
  }

  export type GalleryCreateNestedOneWithoutPhotosInput = {
    create?: XOR<GalleryCreateWithoutPhotosInput, GalleryUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: GalleryCreateOrConnectWithoutPhotosInput
    connect?: GalleryWhereUniqueInput
  }

  export type GalleryCreateNestedManyWithoutCoverPhotoInput = {
    create?: XOR<GalleryCreateWithoutCoverPhotoInput, GalleryUncheckedCreateWithoutCoverPhotoInput> | GalleryCreateWithoutCoverPhotoInput[] | GalleryUncheckedCreateWithoutCoverPhotoInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutCoverPhotoInput | GalleryCreateOrConnectWithoutCoverPhotoInput[]
    createMany?: GalleryCreateManyCoverPhotoInputEnvelope
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
  }

  export type AlbumPhotoCreateNestedManyWithoutPhotoInput = {
    create?: XOR<AlbumPhotoCreateWithoutPhotoInput, AlbumPhotoUncheckedCreateWithoutPhotoInput> | AlbumPhotoCreateWithoutPhotoInput[] | AlbumPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutPhotoInput | AlbumPhotoCreateOrConnectWithoutPhotoInput[]
    createMany?: AlbumPhotoCreateManyPhotoInputEnvelope
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
  }

  export type GalleryUncheckedCreateNestedManyWithoutCoverPhotoInput = {
    create?: XOR<GalleryCreateWithoutCoverPhotoInput, GalleryUncheckedCreateWithoutCoverPhotoInput> | GalleryCreateWithoutCoverPhotoInput[] | GalleryUncheckedCreateWithoutCoverPhotoInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutCoverPhotoInput | GalleryCreateOrConnectWithoutCoverPhotoInput[]
    createMany?: GalleryCreateManyCoverPhotoInputEnvelope
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
  }

  export type AlbumPhotoUncheckedCreateNestedManyWithoutPhotoInput = {
    create?: XOR<AlbumPhotoCreateWithoutPhotoInput, AlbumPhotoUncheckedCreateWithoutPhotoInput> | AlbumPhotoCreateWithoutPhotoInput[] | AlbumPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutPhotoInput | AlbumPhotoCreateOrConnectWithoutPhotoInput[]
    createMany?: AlbumPhotoCreateManyPhotoInputEnvelope
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PhotoUpdateaiTagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type GalleryUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<GalleryCreateWithoutPhotosInput, GalleryUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: GalleryCreateOrConnectWithoutPhotosInput
    upsert?: GalleryUpsertWithoutPhotosInput
    connect?: GalleryWhereUniqueInput
    update?: XOR<XOR<GalleryUpdateToOneWithWhereWithoutPhotosInput, GalleryUpdateWithoutPhotosInput>, GalleryUncheckedUpdateWithoutPhotosInput>
  }

  export type GalleryUpdateManyWithoutCoverPhotoNestedInput = {
    create?: XOR<GalleryCreateWithoutCoverPhotoInput, GalleryUncheckedCreateWithoutCoverPhotoInput> | GalleryCreateWithoutCoverPhotoInput[] | GalleryUncheckedCreateWithoutCoverPhotoInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutCoverPhotoInput | GalleryCreateOrConnectWithoutCoverPhotoInput[]
    upsert?: GalleryUpsertWithWhereUniqueWithoutCoverPhotoInput | GalleryUpsertWithWhereUniqueWithoutCoverPhotoInput[]
    createMany?: GalleryCreateManyCoverPhotoInputEnvelope
    set?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    disconnect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    delete?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    update?: GalleryUpdateWithWhereUniqueWithoutCoverPhotoInput | GalleryUpdateWithWhereUniqueWithoutCoverPhotoInput[]
    updateMany?: GalleryUpdateManyWithWhereWithoutCoverPhotoInput | GalleryUpdateManyWithWhereWithoutCoverPhotoInput[]
    deleteMany?: GalleryScalarWhereInput | GalleryScalarWhereInput[]
  }

  export type AlbumPhotoUpdateManyWithoutPhotoNestedInput = {
    create?: XOR<AlbumPhotoCreateWithoutPhotoInput, AlbumPhotoUncheckedCreateWithoutPhotoInput> | AlbumPhotoCreateWithoutPhotoInput[] | AlbumPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutPhotoInput | AlbumPhotoCreateOrConnectWithoutPhotoInput[]
    upsert?: AlbumPhotoUpsertWithWhereUniqueWithoutPhotoInput | AlbumPhotoUpsertWithWhereUniqueWithoutPhotoInput[]
    createMany?: AlbumPhotoCreateManyPhotoInputEnvelope
    set?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    disconnect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    delete?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    update?: AlbumPhotoUpdateWithWhereUniqueWithoutPhotoInput | AlbumPhotoUpdateWithWhereUniqueWithoutPhotoInput[]
    updateMany?: AlbumPhotoUpdateManyWithWhereWithoutPhotoInput | AlbumPhotoUpdateManyWithWhereWithoutPhotoInput[]
    deleteMany?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
  }

  export type GalleryUncheckedUpdateManyWithoutCoverPhotoNestedInput = {
    create?: XOR<GalleryCreateWithoutCoverPhotoInput, GalleryUncheckedCreateWithoutCoverPhotoInput> | GalleryCreateWithoutCoverPhotoInput[] | GalleryUncheckedCreateWithoutCoverPhotoInput[]
    connectOrCreate?: GalleryCreateOrConnectWithoutCoverPhotoInput | GalleryCreateOrConnectWithoutCoverPhotoInput[]
    upsert?: GalleryUpsertWithWhereUniqueWithoutCoverPhotoInput | GalleryUpsertWithWhereUniqueWithoutCoverPhotoInput[]
    createMany?: GalleryCreateManyCoverPhotoInputEnvelope
    set?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    disconnect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    delete?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    connect?: GalleryWhereUniqueInput | GalleryWhereUniqueInput[]
    update?: GalleryUpdateWithWhereUniqueWithoutCoverPhotoInput | GalleryUpdateWithWhereUniqueWithoutCoverPhotoInput[]
    updateMany?: GalleryUpdateManyWithWhereWithoutCoverPhotoInput | GalleryUpdateManyWithWhereWithoutCoverPhotoInput[]
    deleteMany?: GalleryScalarWhereInput | GalleryScalarWhereInput[]
  }

  export type AlbumPhotoUncheckedUpdateManyWithoutPhotoNestedInput = {
    create?: XOR<AlbumPhotoCreateWithoutPhotoInput, AlbumPhotoUncheckedCreateWithoutPhotoInput> | AlbumPhotoCreateWithoutPhotoInput[] | AlbumPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutPhotoInput | AlbumPhotoCreateOrConnectWithoutPhotoInput[]
    upsert?: AlbumPhotoUpsertWithWhereUniqueWithoutPhotoInput | AlbumPhotoUpsertWithWhereUniqueWithoutPhotoInput[]
    createMany?: AlbumPhotoCreateManyPhotoInputEnvelope
    set?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    disconnect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    delete?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    update?: AlbumPhotoUpdateWithWhereUniqueWithoutPhotoInput | AlbumPhotoUpdateWithWhereUniqueWithoutPhotoInput[]
    updateMany?: AlbumPhotoUpdateManyWithWhereWithoutPhotoInput | AlbumPhotoUpdateManyWithWhereWithoutPhotoInput[]
    deleteMany?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutStorageEventsInput = {
    create?: XOR<UserCreateWithoutStorageEventsInput, UserUncheckedCreateWithoutStorageEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStorageEventsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutStorageEventsNestedInput = {
    create?: XOR<UserCreateWithoutStorageEventsInput, UserUncheckedCreateWithoutStorageEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutStorageEventsInput
    upsert?: UserUpsertWithoutStorageEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStorageEventsInput, UserUpdateWithoutStorageEventsInput>, UserUncheckedUpdateWithoutStorageEventsInput>
  }

  export type UserCreateNestedOneWithoutClientsInput = {
    create?: XOR<UserCreateWithoutClientsInput, UserUncheckedCreateWithoutClientsInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientsInput
    connect?: UserWhereUniqueInput
  }

  export type GalleryClientCreateNestedManyWithoutClientInput = {
    create?: XOR<GalleryClientCreateWithoutClientInput, GalleryClientUncheckedCreateWithoutClientInput> | GalleryClientCreateWithoutClientInput[] | GalleryClientUncheckedCreateWithoutClientInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutClientInput | GalleryClientCreateOrConnectWithoutClientInput[]
    createMany?: GalleryClientCreateManyClientInputEnvelope
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
  }

  export type GalleryClientUncheckedCreateNestedManyWithoutClientInput = {
    create?: XOR<GalleryClientCreateWithoutClientInput, GalleryClientUncheckedCreateWithoutClientInput> | GalleryClientCreateWithoutClientInput[] | GalleryClientUncheckedCreateWithoutClientInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutClientInput | GalleryClientCreateOrConnectWithoutClientInput[]
    createMany?: GalleryClientCreateManyClientInputEnvelope
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutClientsNestedInput = {
    create?: XOR<UserCreateWithoutClientsInput, UserUncheckedCreateWithoutClientsInput>
    connectOrCreate?: UserCreateOrConnectWithoutClientsInput
    upsert?: UserUpsertWithoutClientsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutClientsInput, UserUpdateWithoutClientsInput>, UserUncheckedUpdateWithoutClientsInput>
  }

  export type GalleryClientUpdateManyWithoutClientNestedInput = {
    create?: XOR<GalleryClientCreateWithoutClientInput, GalleryClientUncheckedCreateWithoutClientInput> | GalleryClientCreateWithoutClientInput[] | GalleryClientUncheckedCreateWithoutClientInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutClientInput | GalleryClientCreateOrConnectWithoutClientInput[]
    upsert?: GalleryClientUpsertWithWhereUniqueWithoutClientInput | GalleryClientUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: GalleryClientCreateManyClientInputEnvelope
    set?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    disconnect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    delete?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    update?: GalleryClientUpdateWithWhereUniqueWithoutClientInput | GalleryClientUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: GalleryClientUpdateManyWithWhereWithoutClientInput | GalleryClientUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: GalleryClientScalarWhereInput | GalleryClientScalarWhereInput[]
  }

  export type GalleryClientUncheckedUpdateManyWithoutClientNestedInput = {
    create?: XOR<GalleryClientCreateWithoutClientInput, GalleryClientUncheckedCreateWithoutClientInput> | GalleryClientCreateWithoutClientInput[] | GalleryClientUncheckedCreateWithoutClientInput[]
    connectOrCreate?: GalleryClientCreateOrConnectWithoutClientInput | GalleryClientCreateOrConnectWithoutClientInput[]
    upsert?: GalleryClientUpsertWithWhereUniqueWithoutClientInput | GalleryClientUpsertWithWhereUniqueWithoutClientInput[]
    createMany?: GalleryClientCreateManyClientInputEnvelope
    set?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    disconnect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    delete?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    connect?: GalleryClientWhereUniqueInput | GalleryClientWhereUniqueInput[]
    update?: GalleryClientUpdateWithWhereUniqueWithoutClientInput | GalleryClientUpdateWithWhereUniqueWithoutClientInput[]
    updateMany?: GalleryClientUpdateManyWithWhereWithoutClientInput | GalleryClientUpdateManyWithWhereWithoutClientInput[]
    deleteMany?: GalleryClientScalarWhereInput | GalleryClientScalarWhereInput[]
  }

  export type GalleryCreateNestedOneWithoutClientsInput = {
    create?: XOR<GalleryCreateWithoutClientsInput, GalleryUncheckedCreateWithoutClientsInput>
    connectOrCreate?: GalleryCreateOrConnectWithoutClientsInput
    connect?: GalleryWhereUniqueInput
  }

  export type ClientCreateNestedOneWithoutGalleriesInput = {
    create?: XOR<ClientCreateWithoutGalleriesInput, ClientUncheckedCreateWithoutGalleriesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutGalleriesInput
    connect?: ClientWhereUniqueInput
  }

  export type GalleryUpdateOneRequiredWithoutClientsNestedInput = {
    create?: XOR<GalleryCreateWithoutClientsInput, GalleryUncheckedCreateWithoutClientsInput>
    connectOrCreate?: GalleryCreateOrConnectWithoutClientsInput
    upsert?: GalleryUpsertWithoutClientsInput
    connect?: GalleryWhereUniqueInput
    update?: XOR<XOR<GalleryUpdateToOneWithWhereWithoutClientsInput, GalleryUpdateWithoutClientsInput>, GalleryUncheckedUpdateWithoutClientsInput>
  }

  export type ClientUpdateOneRequiredWithoutGalleriesNestedInput = {
    create?: XOR<ClientCreateWithoutGalleriesInput, ClientUncheckedCreateWithoutGalleriesInput>
    connectOrCreate?: ClientCreateOrConnectWithoutGalleriesInput
    upsert?: ClientUpsertWithoutGalleriesInput
    connect?: ClientWhereUniqueInput
    update?: XOR<XOR<ClientUpdateToOneWithWhereWithoutGalleriesInput, ClientUpdateWithoutGalleriesInput>, ClientUncheckedUpdateWithoutGalleriesInput>
  }

  export type GalleryCreateNestedOneWithoutAlbumsInput = {
    create?: XOR<GalleryCreateWithoutAlbumsInput, GalleryUncheckedCreateWithoutAlbumsInput>
    connectOrCreate?: GalleryCreateOrConnectWithoutAlbumsInput
    connect?: GalleryWhereUniqueInput
  }

  export type AlbumPhotoCreateNestedManyWithoutAlbumInput = {
    create?: XOR<AlbumPhotoCreateWithoutAlbumInput, AlbumPhotoUncheckedCreateWithoutAlbumInput> | AlbumPhotoCreateWithoutAlbumInput[] | AlbumPhotoUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutAlbumInput | AlbumPhotoCreateOrConnectWithoutAlbumInput[]
    createMany?: AlbumPhotoCreateManyAlbumInputEnvelope
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
  }

  export type AlbumPhotoUncheckedCreateNestedManyWithoutAlbumInput = {
    create?: XOR<AlbumPhotoCreateWithoutAlbumInput, AlbumPhotoUncheckedCreateWithoutAlbumInput> | AlbumPhotoCreateWithoutAlbumInput[] | AlbumPhotoUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutAlbumInput | AlbumPhotoCreateOrConnectWithoutAlbumInput[]
    createMany?: AlbumPhotoCreateManyAlbumInputEnvelope
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
  }

  export type GalleryUpdateOneRequiredWithoutAlbumsNestedInput = {
    create?: XOR<GalleryCreateWithoutAlbumsInput, GalleryUncheckedCreateWithoutAlbumsInput>
    connectOrCreate?: GalleryCreateOrConnectWithoutAlbumsInput
    upsert?: GalleryUpsertWithoutAlbumsInput
    connect?: GalleryWhereUniqueInput
    update?: XOR<XOR<GalleryUpdateToOneWithWhereWithoutAlbumsInput, GalleryUpdateWithoutAlbumsInput>, GalleryUncheckedUpdateWithoutAlbumsInput>
  }

  export type AlbumPhotoUpdateManyWithoutAlbumNestedInput = {
    create?: XOR<AlbumPhotoCreateWithoutAlbumInput, AlbumPhotoUncheckedCreateWithoutAlbumInput> | AlbumPhotoCreateWithoutAlbumInput[] | AlbumPhotoUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutAlbumInput | AlbumPhotoCreateOrConnectWithoutAlbumInput[]
    upsert?: AlbumPhotoUpsertWithWhereUniqueWithoutAlbumInput | AlbumPhotoUpsertWithWhereUniqueWithoutAlbumInput[]
    createMany?: AlbumPhotoCreateManyAlbumInputEnvelope
    set?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    disconnect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    delete?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    update?: AlbumPhotoUpdateWithWhereUniqueWithoutAlbumInput | AlbumPhotoUpdateWithWhereUniqueWithoutAlbumInput[]
    updateMany?: AlbumPhotoUpdateManyWithWhereWithoutAlbumInput | AlbumPhotoUpdateManyWithWhereWithoutAlbumInput[]
    deleteMany?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
  }

  export type AlbumPhotoUncheckedUpdateManyWithoutAlbumNestedInput = {
    create?: XOR<AlbumPhotoCreateWithoutAlbumInput, AlbumPhotoUncheckedCreateWithoutAlbumInput> | AlbumPhotoCreateWithoutAlbumInput[] | AlbumPhotoUncheckedCreateWithoutAlbumInput[]
    connectOrCreate?: AlbumPhotoCreateOrConnectWithoutAlbumInput | AlbumPhotoCreateOrConnectWithoutAlbumInput[]
    upsert?: AlbumPhotoUpsertWithWhereUniqueWithoutAlbumInput | AlbumPhotoUpsertWithWhereUniqueWithoutAlbumInput[]
    createMany?: AlbumPhotoCreateManyAlbumInputEnvelope
    set?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    disconnect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    delete?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    connect?: AlbumPhotoWhereUniqueInput | AlbumPhotoWhereUniqueInput[]
    update?: AlbumPhotoUpdateWithWhereUniqueWithoutAlbumInput | AlbumPhotoUpdateWithWhereUniqueWithoutAlbumInput[]
    updateMany?: AlbumPhotoUpdateManyWithWhereWithoutAlbumInput | AlbumPhotoUpdateManyWithWhereWithoutAlbumInput[]
    deleteMany?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
  }

  export type AlbumCreateNestedOneWithoutPhotosInput = {
    create?: XOR<AlbumCreateWithoutPhotosInput, AlbumUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: AlbumCreateOrConnectWithoutPhotosInput
    connect?: AlbumWhereUniqueInput
  }

  export type PhotoCreateNestedOneWithoutAlbumPhotosInput = {
    create?: XOR<PhotoCreateWithoutAlbumPhotosInput, PhotoUncheckedCreateWithoutAlbumPhotosInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutAlbumPhotosInput
    connect?: PhotoWhereUniqueInput
  }

  export type AlbumUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<AlbumCreateWithoutPhotosInput, AlbumUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: AlbumCreateOrConnectWithoutPhotosInput
    upsert?: AlbumUpsertWithoutPhotosInput
    connect?: AlbumWhereUniqueInput
    update?: XOR<XOR<AlbumUpdateToOneWithWhereWithoutPhotosInput, AlbumUpdateWithoutPhotosInput>, AlbumUncheckedUpdateWithoutPhotosInput>
  }

  export type PhotoUpdateOneRequiredWithoutAlbumPhotosNestedInput = {
    create?: XOR<PhotoCreateWithoutAlbumPhotosInput, PhotoUncheckedCreateWithoutAlbumPhotosInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutAlbumPhotosInput
    upsert?: PhotoUpsertWithoutAlbumPhotosInput
    connect?: PhotoWhereUniqueInput
    update?: XOR<XOR<PhotoUpdateToOneWithWhereWithoutAlbumPhotosInput, PhotoUpdateWithoutAlbumPhotosInput>, PhotoUncheckedUpdateWithoutAlbumPhotosInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumPlanFilter<$PrismaModel = never> = {
    equals?: $Enums.Plan | EnumPlanFieldRefInput<$PrismaModel>
    in?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanFilter<$PrismaModel> | $Enums.Plan
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumPlanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Plan | EnumPlanFieldRefInput<$PrismaModel>
    in?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.Plan[] | ListEnumPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanWithAggregatesFilter<$PrismaModel> | $Enums.Plan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanFilter<$PrismaModel>
    _max?: NestedEnumPlanFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumPlanTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeFilter<$PrismaModel> | $Enums.PlanType
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlanType | EnumPlanTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlanType[] | ListEnumPlanTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPlanTypeWithAggregatesFilter<$PrismaModel> | $Enums.PlanType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlanTypeFilter<$PrismaModel>
    _max?: NestedEnumPlanTypeFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedEnumUserTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.UserType | EnumUserTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeFilter<$PrismaModel> | $Enums.UserType
  }

  export type NestedEnumPhotographyLevelNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.PhotographyLevel | EnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPhotographyLevelNullableFilter<$PrismaModel> | $Enums.PhotographyLevel | null
  }

  export type NestedEnumContactMethodNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactMethod | EnumContactMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContactMethodNullableFilter<$PrismaModel> | $Enums.ContactMethod | null
  }

  export type NestedEnumUserTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserType | EnumUserTypeFieldRefInput<$PrismaModel>
    in?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserType[] | ListEnumUserTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeWithAggregatesFilter<$PrismaModel> | $Enums.UserType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserTypeFilter<$PrismaModel>
    _max?: NestedEnumUserTypeFilter<$PrismaModel>
  }

  export type NestedEnumPhotographyLevelNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PhotographyLevel | EnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    in?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.PhotographyLevel[] | ListEnumPhotographyLevelFieldRefInput<$PrismaModel> | null
    not?: NestedEnumPhotographyLevelNullableWithAggregatesFilter<$PrismaModel> | $Enums.PhotographyLevel | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumPhotographyLevelNullableFilter<$PrismaModel>
    _max?: NestedEnumPhotographyLevelNullableFilter<$PrismaModel>
  }

  export type NestedEnumContactMethodNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ContactMethod | EnumContactMethodFieldRefInput<$PrismaModel> | null
    in?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.ContactMethod[] | ListEnumContactMethodFieldRefInput<$PrismaModel> | null
    not?: NestedEnumContactMethodNullableWithAggregatesFilter<$PrismaModel> | $Enums.ContactMethod | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumContactMethodNullableFilter<$PrismaModel>
    _max?: NestedEnumContactMethodNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PaymentCreateWithoutUserInput = {
    planId: number
    plan: $Enums.PlanType
    planExpiresAt?: Date | string | null
    planStartedAt?: Date | string | null
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status: $Enums.SubscriptionStatus
  }

  export type PaymentUncheckedCreateWithoutUserInput = {
    id?: number
    planId: number
    plan: $Enums.PlanType
    planExpiresAt?: Date | string | null
    planStartedAt?: Date | string | null
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status: $Enums.SubscriptionStatus
  }

  export type PaymentCreateOrConnectWithoutUserInput = {
    where: PaymentWhereUniqueInput
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentCreateManyUserInputEnvelope = {
    data: PaymentCreateManyUserInput | PaymentCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserOnboardingCreateWithoutUserInput = {
    userType: $Enums.UserType
    companyName?: string | null
    companySize?: string | null
    photographyType?: UserOnboardingCreatephotographyTypeInput | string[]
    photographyLevel?: $Enums.PhotographyLevel | null
    contactMethod?: $Enums.ContactMethod | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserOnboardingUncheckedCreateWithoutUserInput = {
    id?: number
    userType: $Enums.UserType
    companyName?: string | null
    companySize?: string | null
    photographyType?: UserOnboardingCreatephotographyTypeInput | string[]
    photographyLevel?: $Enums.PhotographyLevel | null
    contactMethod?: $Enums.ContactMethod | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserOnboardingCreateOrConnectWithoutUserInput = {
    where: UserOnboardingWhereUniqueInput
    create: XOR<UserOnboardingCreateWithoutUserInput, UserOnboardingUncheckedCreateWithoutUserInput>
  }

  export type GalleryCreateWithoutUserInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    coverPhoto?: PhotoCreateNestedOneWithoutUsedAsCoverInInput
    photos?: PhotoCreateNestedManyWithoutGalleryInput
    albums?: AlbumCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientCreateNestedManyWithoutGalleryInput
  }

  export type GalleryUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    coverPhotoId?: string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutGalleryInput
    albums?: AlbumUncheckedCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientUncheckedCreateNestedManyWithoutGalleryInput
  }

  export type GalleryCreateOrConnectWithoutUserInput = {
    where: GalleryWhereUniqueInput
    create: XOR<GalleryCreateWithoutUserInput, GalleryUncheckedCreateWithoutUserInput>
  }

  export type GalleryCreateManyUserInputEnvelope = {
    data: GalleryCreateManyUserInput | GalleryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ClientCreateWithoutUserInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    galleries?: GalleryClientCreateNestedManyWithoutClientInput
  }

  export type ClientUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    galleries?: GalleryClientUncheckedCreateNestedManyWithoutClientInput
  }

  export type ClientCreateOrConnectWithoutUserInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
  }

  export type ClientCreateManyUserInputEnvelope = {
    data: ClientCreateManyUserInput | ClientCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type StorageEventCreateWithoutUserInput = {
    id?: string
    photoId?: string | null
    delta: bigint | number
    reason: string
    createdAt?: Date | string
  }

  export type StorageEventUncheckedCreateWithoutUserInput = {
    id?: string
    photoId?: string | null
    delta: bigint | number
    reason: string
    createdAt?: Date | string
  }

  export type StorageEventCreateOrConnectWithoutUserInput = {
    where: StorageEventWhereUniqueInput
    create: XOR<StorageEventCreateWithoutUserInput, StorageEventUncheckedCreateWithoutUserInput>
  }

  export type StorageEventCreateManyUserInputEnvelope = {
    data: StorageEventCreateManyUserInput | StorageEventCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    expiresAt?: DateTimeFilter<"Session"> | Date | string
    token?: StringFilter<"Session"> | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    ipAddress?: StringNullableFilter<"Session"> | string | null
    userAgent?: StringNullableFilter<"Session"> | string | null
    userId?: StringFilter<"Session"> | string
    impersonatedBy?: StringNullableFilter<"Session"> | string | null
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    accountId?: StringFilter<"Account"> | string
    providerId?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    accessToken?: StringNullableFilter<"Account"> | string | null
    refreshToken?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    accessTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    refreshTokenExpiresAt?: DateTimeNullableFilter<"Account"> | Date | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    password?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type PaymentUpsertWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    update: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
    create: XOR<PaymentCreateWithoutUserInput, PaymentUncheckedCreateWithoutUserInput>
  }

  export type PaymentUpdateWithWhereUniqueWithoutUserInput = {
    where: PaymentWhereUniqueInput
    data: XOR<PaymentUpdateWithoutUserInput, PaymentUncheckedUpdateWithoutUserInput>
  }

  export type PaymentUpdateManyWithWhereWithoutUserInput = {
    where: PaymentScalarWhereInput
    data: XOR<PaymentUpdateManyMutationInput, PaymentUncheckedUpdateManyWithoutUserInput>
  }

  export type PaymentScalarWhereInput = {
    AND?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    OR?: PaymentScalarWhereInput[]
    NOT?: PaymentScalarWhereInput | PaymentScalarWhereInput[]
    id?: IntFilter<"Payment"> | number
    planId?: IntFilter<"Payment"> | number
    plan?: EnumPlanTypeFilter<"Payment"> | $Enums.PlanType
    planExpiresAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    planStartedAt?: DateTimeNullableFilter<"Payment"> | Date | string | null
    amount_cents?: IntFilter<"Payment"> | number
    transactionId?: IntFilter<"Payment"> | number
    initial_transaction?: IntFilter<"Payment"> | number
    subscriptionId?: IntFilter<"Payment"> | number
    createdAt?: DateTimeFilter<"Payment"> | Date | string
    updatedAt?: DateTimeFilter<"Payment"> | Date | string
    status?: EnumSubscriptionStatusFilter<"Payment"> | $Enums.SubscriptionStatus
    userId?: StringFilter<"Payment"> | string
  }

  export type UserOnboardingUpsertWithoutUserInput = {
    update: XOR<UserOnboardingUpdateWithoutUserInput, UserOnboardingUncheckedUpdateWithoutUserInput>
    create: XOR<UserOnboardingCreateWithoutUserInput, UserOnboardingUncheckedCreateWithoutUserInput>
    where?: UserOnboardingWhereInput
  }

  export type UserOnboardingUpdateToOneWithWhereWithoutUserInput = {
    where?: UserOnboardingWhereInput
    data: XOR<UserOnboardingUpdateWithoutUserInput, UserOnboardingUncheckedUpdateWithoutUserInput>
  }

  export type UserOnboardingUpdateWithoutUserInput = {
    userType?: EnumUserTypeFieldUpdateOperationsInput | $Enums.UserType
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    photographyType?: UserOnboardingUpdatephotographyTypeInput | string[]
    photographyLevel?: NullableEnumPhotographyLevelFieldUpdateOperationsInput | $Enums.PhotographyLevel | null
    contactMethod?: NullableEnumContactMethodFieldUpdateOperationsInput | $Enums.ContactMethod | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserOnboardingUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    userType?: EnumUserTypeFieldUpdateOperationsInput | $Enums.UserType
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companySize?: NullableStringFieldUpdateOperationsInput | string | null
    photographyType?: UserOnboardingUpdatephotographyTypeInput | string[]
    photographyLevel?: NullableEnumPhotographyLevelFieldUpdateOperationsInput | $Enums.PhotographyLevel | null
    contactMethod?: NullableEnumContactMethodFieldUpdateOperationsInput | $Enums.ContactMethod | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryUpsertWithWhereUniqueWithoutUserInput = {
    where: GalleryWhereUniqueInput
    update: XOR<GalleryUpdateWithoutUserInput, GalleryUncheckedUpdateWithoutUserInput>
    create: XOR<GalleryCreateWithoutUserInput, GalleryUncheckedCreateWithoutUserInput>
  }

  export type GalleryUpdateWithWhereUniqueWithoutUserInput = {
    where: GalleryWhereUniqueInput
    data: XOR<GalleryUpdateWithoutUserInput, GalleryUncheckedUpdateWithoutUserInput>
  }

  export type GalleryUpdateManyWithWhereWithoutUserInput = {
    where: GalleryScalarWhereInput
    data: XOR<GalleryUpdateManyMutationInput, GalleryUncheckedUpdateManyWithoutUserInput>
  }

  export type GalleryScalarWhereInput = {
    AND?: GalleryScalarWhereInput | GalleryScalarWhereInput[]
    OR?: GalleryScalarWhereInput[]
    NOT?: GalleryScalarWhereInput | GalleryScalarWhereInput[]
    id?: StringFilter<"Gallery"> | string
    userId?: StringFilter<"Gallery"> | string
    title?: StringFilter<"Gallery"> | string
    slug?: StringFilter<"Gallery"> | string
    eventDate?: DateTimeNullableFilter<"Gallery"> | Date | string | null
    deadline?: DateTimeNullableFilter<"Gallery"> | Date | string | null
    coverPhotoId?: StringNullableFilter<"Gallery"> | string | null
    passwordHash?: StringNullableFilter<"Gallery"> | string | null
    shareToken?: StringFilter<"Gallery"> | string
    isPublished?: BoolFilter<"Gallery"> | boolean
    createdAt?: DateTimeFilter<"Gallery"> | Date | string
    updatedAt?: DateTimeFilter<"Gallery"> | Date | string
  }

  export type ClientUpsertWithWhereUniqueWithoutUserInput = {
    where: ClientWhereUniqueInput
    update: XOR<ClientUpdateWithoutUserInput, ClientUncheckedUpdateWithoutUserInput>
    create: XOR<ClientCreateWithoutUserInput, ClientUncheckedCreateWithoutUserInput>
  }

  export type ClientUpdateWithWhereUniqueWithoutUserInput = {
    where: ClientWhereUniqueInput
    data: XOR<ClientUpdateWithoutUserInput, ClientUncheckedUpdateWithoutUserInput>
  }

  export type ClientUpdateManyWithWhereWithoutUserInput = {
    where: ClientScalarWhereInput
    data: XOR<ClientUpdateManyMutationInput, ClientUncheckedUpdateManyWithoutUserInput>
  }

  export type ClientScalarWhereInput = {
    AND?: ClientScalarWhereInput | ClientScalarWhereInput[]
    OR?: ClientScalarWhereInput[]
    NOT?: ClientScalarWhereInput | ClientScalarWhereInput[]
    id?: StringFilter<"Client"> | string
    userId?: StringFilter<"Client"> | string
    name?: StringFilter<"Client"> | string
    email?: StringFilter<"Client"> | string
    phone?: StringNullableFilter<"Client"> | string | null
    createdAt?: DateTimeFilter<"Client"> | Date | string
    updatedAt?: DateTimeFilter<"Client"> | Date | string
  }

  export type StorageEventUpsertWithWhereUniqueWithoutUserInput = {
    where: StorageEventWhereUniqueInput
    update: XOR<StorageEventUpdateWithoutUserInput, StorageEventUncheckedUpdateWithoutUserInput>
    create: XOR<StorageEventCreateWithoutUserInput, StorageEventUncheckedCreateWithoutUserInput>
  }

  export type StorageEventUpdateWithWhereUniqueWithoutUserInput = {
    where: StorageEventWhereUniqueInput
    data: XOR<StorageEventUpdateWithoutUserInput, StorageEventUncheckedUpdateWithoutUserInput>
  }

  export type StorageEventUpdateManyWithWhereWithoutUserInput = {
    where: StorageEventScalarWhereInput
    data: XOR<StorageEventUpdateManyMutationInput, StorageEventUncheckedUpdateManyWithoutUserInput>
  }

  export type StorageEventScalarWhereInput = {
    AND?: StorageEventScalarWhereInput | StorageEventScalarWhereInput[]
    OR?: StorageEventScalarWhereInput[]
    NOT?: StorageEventScalarWhereInput | StorageEventScalarWhereInput[]
    id?: StringFilter<"StorageEvent"> | string
    userId?: StringFilter<"StorageEvent"> | string
    photoId?: StringNullableFilter<"StorageEvent"> | string | null
    delta?: BigIntFilter<"StorageEvent"> | bigint | number
    reason?: StringFilter<"StorageEvent"> | string
    createdAt?: DateTimeFilter<"StorageEvent"> | Date | string
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    accounts?: AccountCreateNestedManyWithoutUserInput
    payment?: PaymentCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingCreateNestedOneWithoutUserInput
    galleries?: GalleryCreateNestedManyWithoutUserInput
    clients?: ClientCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingUncheckedCreateNestedOneWithoutUserInput
    galleries?: GalleryUncheckedCreateNestedManyWithoutUserInput
    clients?: ClientUncheckedCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    accounts?: AccountUpdateManyWithoutUserNestedInput
    payment?: PaymentUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUpdateOneWithoutUserNestedInput
    galleries?: GalleryUpdateManyWithoutUserNestedInput
    clients?: ClientUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUncheckedUpdateOneWithoutUserNestedInput
    galleries?: GalleryUncheckedUpdateManyWithoutUserNestedInput
    clients?: ClientUncheckedUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    payment?: PaymentCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingCreateNestedOneWithoutUserInput
    galleries?: GalleryCreateNestedManyWithoutUserInput
    clients?: ClientCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingUncheckedCreateNestedOneWithoutUserInput
    galleries?: GalleryUncheckedCreateNestedManyWithoutUserInput
    clients?: ClientUncheckedCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    payment?: PaymentUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUpdateOneWithoutUserNestedInput
    galleries?: GalleryUpdateManyWithoutUserNestedInput
    clients?: ClientUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUncheckedUpdateOneWithoutUserNestedInput
    galleries?: GalleryUncheckedUpdateManyWithoutUserNestedInput
    clients?: ClientUncheckedUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPaymentInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingCreateNestedOneWithoutUserInput
    galleries?: GalleryCreateNestedManyWithoutUserInput
    clients?: ClientCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPaymentInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingUncheckedCreateNestedOneWithoutUserInput
    galleries?: GalleryUncheckedCreateNestedManyWithoutUserInput
    clients?: ClientUncheckedCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPaymentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
  }

  export type UserUpsertWithoutPaymentInput = {
    update: XOR<UserUpdateWithoutPaymentInput, UserUncheckedUpdateWithoutPaymentInput>
    create: XOR<UserCreateWithoutPaymentInput, UserUncheckedCreateWithoutPaymentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPaymentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPaymentInput, UserUncheckedUpdateWithoutPaymentInput>
  }

  export type UserUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUpdateOneWithoutUserNestedInput
    galleries?: GalleryUpdateManyWithoutUserNestedInput
    clients?: ClientUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUncheckedUpdateOneWithoutUserNestedInput
    galleries?: GalleryUncheckedUpdateManyWithoutUserNestedInput
    clients?: ClientUncheckedUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutUserOnboardingInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    payment?: PaymentCreateNestedManyWithoutUserInput
    galleries?: GalleryCreateNestedManyWithoutUserInput
    clients?: ClientCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserOnboardingInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    galleries?: GalleryUncheckedCreateNestedManyWithoutUserInput
    clients?: ClientUncheckedCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserOnboardingInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserOnboardingInput, UserUncheckedCreateWithoutUserOnboardingInput>
  }

  export type UserUpsertWithoutUserOnboardingInput = {
    update: XOR<UserUpdateWithoutUserOnboardingInput, UserUncheckedUpdateWithoutUserOnboardingInput>
    create: XOR<UserCreateWithoutUserOnboardingInput, UserUncheckedCreateWithoutUserOnboardingInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserOnboardingInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserOnboardingInput, UserUncheckedUpdateWithoutUserOnboardingInput>
  }

  export type UserUpdateWithoutUserOnboardingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    payment?: PaymentUpdateManyWithoutUserNestedInput
    galleries?: GalleryUpdateManyWithoutUserNestedInput
    clients?: ClientUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserOnboardingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    galleries?: GalleryUncheckedUpdateManyWithoutUserNestedInput
    clients?: ClientUncheckedUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutGalleriesInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    payment?: PaymentCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingCreateNestedOneWithoutUserInput
    clients?: ClientCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGalleriesInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingUncheckedCreateNestedOneWithoutUserInput
    clients?: ClientUncheckedCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGalleriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGalleriesInput, UserUncheckedCreateWithoutGalleriesInput>
  }

  export type PhotoCreateWithoutUsedAsCoverInInput = {
    id?: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    gallery: GalleryCreateNestedOneWithoutPhotosInput
    albumPhotos?: AlbumPhotoCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUncheckedCreateWithoutUsedAsCoverInInput = {
    id?: string
    galleryId: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    albumPhotos?: AlbumPhotoUncheckedCreateNestedManyWithoutPhotoInput
  }

  export type PhotoCreateOrConnectWithoutUsedAsCoverInInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutUsedAsCoverInInput, PhotoUncheckedCreateWithoutUsedAsCoverInInput>
  }

  export type PhotoCreateWithoutGalleryInput = {
    id?: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    usedAsCoverIn?: GalleryCreateNestedManyWithoutCoverPhotoInput
    albumPhotos?: AlbumPhotoCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUncheckedCreateWithoutGalleryInput = {
    id?: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    usedAsCoverIn?: GalleryUncheckedCreateNestedManyWithoutCoverPhotoInput
    albumPhotos?: AlbumPhotoUncheckedCreateNestedManyWithoutPhotoInput
  }

  export type PhotoCreateOrConnectWithoutGalleryInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutGalleryInput, PhotoUncheckedCreateWithoutGalleryInput>
  }

  export type PhotoCreateManyGalleryInputEnvelope = {
    data: PhotoCreateManyGalleryInput | PhotoCreateManyGalleryInput[]
    skipDuplicates?: boolean
  }

  export type AlbumCreateWithoutGalleryInput = {
    id?: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: AlbumPhotoCreateNestedManyWithoutAlbumInput
  }

  export type AlbumUncheckedCreateWithoutGalleryInput = {
    id?: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: AlbumPhotoUncheckedCreateNestedManyWithoutAlbumInput
  }

  export type AlbumCreateOrConnectWithoutGalleryInput = {
    where: AlbumWhereUniqueInput
    create: XOR<AlbumCreateWithoutGalleryInput, AlbumUncheckedCreateWithoutGalleryInput>
  }

  export type AlbumCreateManyGalleryInputEnvelope = {
    data: AlbumCreateManyGalleryInput | AlbumCreateManyGalleryInput[]
    skipDuplicates?: boolean
  }

  export type GalleryClientCreateWithoutGalleryInput = {
    createdAt?: Date | string
    client: ClientCreateNestedOneWithoutGalleriesInput
  }

  export type GalleryClientUncheckedCreateWithoutGalleryInput = {
    clientId: string
    createdAt?: Date | string
  }

  export type GalleryClientCreateOrConnectWithoutGalleryInput = {
    where: GalleryClientWhereUniqueInput
    create: XOR<GalleryClientCreateWithoutGalleryInput, GalleryClientUncheckedCreateWithoutGalleryInput>
  }

  export type GalleryClientCreateManyGalleryInputEnvelope = {
    data: GalleryClientCreateManyGalleryInput | GalleryClientCreateManyGalleryInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutGalleriesInput = {
    update: XOR<UserUpdateWithoutGalleriesInput, UserUncheckedUpdateWithoutGalleriesInput>
    create: XOR<UserCreateWithoutGalleriesInput, UserUncheckedCreateWithoutGalleriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGalleriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGalleriesInput, UserUncheckedUpdateWithoutGalleriesInput>
  }

  export type UserUpdateWithoutGalleriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    payment?: PaymentUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUpdateOneWithoutUserNestedInput
    clients?: ClientUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGalleriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUncheckedUpdateOneWithoutUserNestedInput
    clients?: ClientUncheckedUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PhotoUpsertWithoutUsedAsCoverInInput = {
    update: XOR<PhotoUpdateWithoutUsedAsCoverInInput, PhotoUncheckedUpdateWithoutUsedAsCoverInInput>
    create: XOR<PhotoCreateWithoutUsedAsCoverInInput, PhotoUncheckedCreateWithoutUsedAsCoverInInput>
    where?: PhotoWhereInput
  }

  export type PhotoUpdateToOneWithWhereWithoutUsedAsCoverInInput = {
    where?: PhotoWhereInput
    data: XOR<PhotoUpdateWithoutUsedAsCoverInInput, PhotoUncheckedUpdateWithoutUsedAsCoverInInput>
  }

  export type PhotoUpdateWithoutUsedAsCoverInInput = {
    id?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gallery?: GalleryUpdateOneRequiredWithoutPhotosNestedInput
    albumPhotos?: AlbumPhotoUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutUsedAsCoverInInput = {
    id?: StringFieldUpdateOperationsInput | string
    galleryId?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    albumPhotos?: AlbumPhotoUncheckedUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUpsertWithWhereUniqueWithoutGalleryInput = {
    where: PhotoWhereUniqueInput
    update: XOR<PhotoUpdateWithoutGalleryInput, PhotoUncheckedUpdateWithoutGalleryInput>
    create: XOR<PhotoCreateWithoutGalleryInput, PhotoUncheckedCreateWithoutGalleryInput>
  }

  export type PhotoUpdateWithWhereUniqueWithoutGalleryInput = {
    where: PhotoWhereUniqueInput
    data: XOR<PhotoUpdateWithoutGalleryInput, PhotoUncheckedUpdateWithoutGalleryInput>
  }

  export type PhotoUpdateManyWithWhereWithoutGalleryInput = {
    where: PhotoScalarWhereInput
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyWithoutGalleryInput>
  }

  export type PhotoScalarWhereInput = {
    AND?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    OR?: PhotoScalarWhereInput[]
    NOT?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    id?: StringFilter<"Photo"> | string
    galleryId?: StringFilter<"Photo"> | string
    s3Key?: StringFilter<"Photo"> | string
    s3Bucket?: StringFilter<"Photo"> | string
    originalFilename?: StringFilter<"Photo"> | string
    originalSize?: BigIntFilter<"Photo"> | bigint | number
    thumbnailSize?: BigIntFilter<"Photo"> | bigint | number
    previewSize?: BigIntFilter<"Photo"> | bigint | number
    totalSize?: BigIntFilter<"Photo"> | bigint | number
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    mimeType?: StringFilter<"Photo"> | string
    order?: IntFilter<"Photo"> | number
    isCulled?: BoolFilter<"Photo"> | boolean
    loved?: BoolFilter<"Photo"> | boolean
    aiCaption?: StringNullableFilter<"Photo"> | string | null
    aiTags?: StringNullableListFilter<"Photo">
    faceCount?: IntFilter<"Photo"> | number
    thumbnailKey?: StringNullableFilter<"Photo"> | string | null
    previewKey?: StringNullableFilter<"Photo"> | string | null
    status?: StringFilter<"Photo"> | string
    createdAt?: DateTimeFilter<"Photo"> | Date | string
  }

  export type AlbumUpsertWithWhereUniqueWithoutGalleryInput = {
    where: AlbumWhereUniqueInput
    update: XOR<AlbumUpdateWithoutGalleryInput, AlbumUncheckedUpdateWithoutGalleryInput>
    create: XOR<AlbumCreateWithoutGalleryInput, AlbumUncheckedCreateWithoutGalleryInput>
  }

  export type AlbumUpdateWithWhereUniqueWithoutGalleryInput = {
    where: AlbumWhereUniqueInput
    data: XOR<AlbumUpdateWithoutGalleryInput, AlbumUncheckedUpdateWithoutGalleryInput>
  }

  export type AlbumUpdateManyWithWhereWithoutGalleryInput = {
    where: AlbumScalarWhereInput
    data: XOR<AlbumUpdateManyMutationInput, AlbumUncheckedUpdateManyWithoutGalleryInput>
  }

  export type AlbumScalarWhereInput = {
    AND?: AlbumScalarWhereInput | AlbumScalarWhereInput[]
    OR?: AlbumScalarWhereInput[]
    NOT?: AlbumScalarWhereInput | AlbumScalarWhereInput[]
    id?: StringFilter<"Album"> | string
    galleryId?: StringFilter<"Album"> | string
    title?: StringFilter<"Album"> | string
    createdAt?: DateTimeFilter<"Album"> | Date | string
    updatedAt?: DateTimeFilter<"Album"> | Date | string
  }

  export type GalleryClientUpsertWithWhereUniqueWithoutGalleryInput = {
    where: GalleryClientWhereUniqueInput
    update: XOR<GalleryClientUpdateWithoutGalleryInput, GalleryClientUncheckedUpdateWithoutGalleryInput>
    create: XOR<GalleryClientCreateWithoutGalleryInput, GalleryClientUncheckedCreateWithoutGalleryInput>
  }

  export type GalleryClientUpdateWithWhereUniqueWithoutGalleryInput = {
    where: GalleryClientWhereUniqueInput
    data: XOR<GalleryClientUpdateWithoutGalleryInput, GalleryClientUncheckedUpdateWithoutGalleryInput>
  }

  export type GalleryClientUpdateManyWithWhereWithoutGalleryInput = {
    where: GalleryClientScalarWhereInput
    data: XOR<GalleryClientUpdateManyMutationInput, GalleryClientUncheckedUpdateManyWithoutGalleryInput>
  }

  export type GalleryClientScalarWhereInput = {
    AND?: GalleryClientScalarWhereInput | GalleryClientScalarWhereInput[]
    OR?: GalleryClientScalarWhereInput[]
    NOT?: GalleryClientScalarWhereInput | GalleryClientScalarWhereInput[]
    galleryId?: StringFilter<"GalleryClient"> | string
    clientId?: StringFilter<"GalleryClient"> | string
    createdAt?: DateTimeFilter<"GalleryClient"> | Date | string
  }

  export type GalleryCreateWithoutPhotosInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGalleriesInput
    coverPhoto?: PhotoCreateNestedOneWithoutUsedAsCoverInInput
    albums?: AlbumCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientCreateNestedManyWithoutGalleryInput
  }

  export type GalleryUncheckedCreateWithoutPhotosInput = {
    id?: string
    userId: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    coverPhotoId?: string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    albums?: AlbumUncheckedCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientUncheckedCreateNestedManyWithoutGalleryInput
  }

  export type GalleryCreateOrConnectWithoutPhotosInput = {
    where: GalleryWhereUniqueInput
    create: XOR<GalleryCreateWithoutPhotosInput, GalleryUncheckedCreateWithoutPhotosInput>
  }

  export type GalleryCreateWithoutCoverPhotoInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGalleriesInput
    photos?: PhotoCreateNestedManyWithoutGalleryInput
    albums?: AlbumCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientCreateNestedManyWithoutGalleryInput
  }

  export type GalleryUncheckedCreateWithoutCoverPhotoInput = {
    id?: string
    userId: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutGalleryInput
    albums?: AlbumUncheckedCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientUncheckedCreateNestedManyWithoutGalleryInput
  }

  export type GalleryCreateOrConnectWithoutCoverPhotoInput = {
    where: GalleryWhereUniqueInput
    create: XOR<GalleryCreateWithoutCoverPhotoInput, GalleryUncheckedCreateWithoutCoverPhotoInput>
  }

  export type GalleryCreateManyCoverPhotoInputEnvelope = {
    data: GalleryCreateManyCoverPhotoInput | GalleryCreateManyCoverPhotoInput[]
    skipDuplicates?: boolean
  }

  export type AlbumPhotoCreateWithoutPhotoInput = {
    createdAt?: Date | string
    album: AlbumCreateNestedOneWithoutPhotosInput
  }

  export type AlbumPhotoUncheckedCreateWithoutPhotoInput = {
    albumId: string
    createdAt?: Date | string
  }

  export type AlbumPhotoCreateOrConnectWithoutPhotoInput = {
    where: AlbumPhotoWhereUniqueInput
    create: XOR<AlbumPhotoCreateWithoutPhotoInput, AlbumPhotoUncheckedCreateWithoutPhotoInput>
  }

  export type AlbumPhotoCreateManyPhotoInputEnvelope = {
    data: AlbumPhotoCreateManyPhotoInput | AlbumPhotoCreateManyPhotoInput[]
    skipDuplicates?: boolean
  }

  export type GalleryUpsertWithoutPhotosInput = {
    update: XOR<GalleryUpdateWithoutPhotosInput, GalleryUncheckedUpdateWithoutPhotosInput>
    create: XOR<GalleryCreateWithoutPhotosInput, GalleryUncheckedCreateWithoutPhotosInput>
    where?: GalleryWhereInput
  }

  export type GalleryUpdateToOneWithWhereWithoutPhotosInput = {
    where?: GalleryWhereInput
    data: XOR<GalleryUpdateWithoutPhotosInput, GalleryUncheckedUpdateWithoutPhotosInput>
  }

  export type GalleryUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGalleriesNestedInput
    coverPhoto?: PhotoUpdateOneWithoutUsedAsCoverInNestedInput
    albums?: AlbumUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coverPhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    albums?: AlbumUncheckedUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUncheckedUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUpsertWithWhereUniqueWithoutCoverPhotoInput = {
    where: GalleryWhereUniqueInput
    update: XOR<GalleryUpdateWithoutCoverPhotoInput, GalleryUncheckedUpdateWithoutCoverPhotoInput>
    create: XOR<GalleryCreateWithoutCoverPhotoInput, GalleryUncheckedCreateWithoutCoverPhotoInput>
  }

  export type GalleryUpdateWithWhereUniqueWithoutCoverPhotoInput = {
    where: GalleryWhereUniqueInput
    data: XOR<GalleryUpdateWithoutCoverPhotoInput, GalleryUncheckedUpdateWithoutCoverPhotoInput>
  }

  export type GalleryUpdateManyWithWhereWithoutCoverPhotoInput = {
    where: GalleryScalarWhereInput
    data: XOR<GalleryUpdateManyMutationInput, GalleryUncheckedUpdateManyWithoutCoverPhotoInput>
  }

  export type AlbumPhotoUpsertWithWhereUniqueWithoutPhotoInput = {
    where: AlbumPhotoWhereUniqueInput
    update: XOR<AlbumPhotoUpdateWithoutPhotoInput, AlbumPhotoUncheckedUpdateWithoutPhotoInput>
    create: XOR<AlbumPhotoCreateWithoutPhotoInput, AlbumPhotoUncheckedCreateWithoutPhotoInput>
  }

  export type AlbumPhotoUpdateWithWhereUniqueWithoutPhotoInput = {
    where: AlbumPhotoWhereUniqueInput
    data: XOR<AlbumPhotoUpdateWithoutPhotoInput, AlbumPhotoUncheckedUpdateWithoutPhotoInput>
  }

  export type AlbumPhotoUpdateManyWithWhereWithoutPhotoInput = {
    where: AlbumPhotoScalarWhereInput
    data: XOR<AlbumPhotoUpdateManyMutationInput, AlbumPhotoUncheckedUpdateManyWithoutPhotoInput>
  }

  export type AlbumPhotoScalarWhereInput = {
    AND?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
    OR?: AlbumPhotoScalarWhereInput[]
    NOT?: AlbumPhotoScalarWhereInput | AlbumPhotoScalarWhereInput[]
    albumId?: StringFilter<"AlbumPhoto"> | string
    photoId?: StringFilter<"AlbumPhoto"> | string
    createdAt?: DateTimeFilter<"AlbumPhoto"> | Date | string
  }

  export type UserCreateWithoutStorageEventsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    payment?: PaymentCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingCreateNestedOneWithoutUserInput
    galleries?: GalleryCreateNestedManyWithoutUserInput
    clients?: ClientCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStorageEventsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingUncheckedCreateNestedOneWithoutUserInput
    galleries?: GalleryUncheckedCreateNestedManyWithoutUserInput
    clients?: ClientUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStorageEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStorageEventsInput, UserUncheckedCreateWithoutStorageEventsInput>
  }

  export type UserUpsertWithoutStorageEventsInput = {
    update: XOR<UserUpdateWithoutStorageEventsInput, UserUncheckedUpdateWithoutStorageEventsInput>
    create: XOR<UserCreateWithoutStorageEventsInput, UserUncheckedCreateWithoutStorageEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStorageEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStorageEventsInput, UserUncheckedUpdateWithoutStorageEventsInput>
  }

  export type UserUpdateWithoutStorageEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    payment?: PaymentUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUpdateOneWithoutUserNestedInput
    galleries?: GalleryUpdateManyWithoutUserNestedInput
    clients?: ClientUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStorageEventsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUncheckedUpdateOneWithoutUserNestedInput
    galleries?: GalleryUncheckedUpdateManyWithoutUserNestedInput
    clients?: ClientUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutClientsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionCreateNestedManyWithoutUserInput
    accounts?: AccountCreateNestedManyWithoutUserInput
    payment?: PaymentCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingCreateNestedOneWithoutUserInput
    galleries?: GalleryCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutClientsInput = {
    id?: string
    name: string
    email: string
    plan?: $Enums.Plan
    storageUsed?: bigint | number
    storageLimit?: bigint | number
    overageBytes?: bigint | number
    overageResetAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubId?: string | null
    warningEmailSent80?: boolean
    warningEmailSent95?: boolean
    emailVerified: boolean
    image?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    role?: string | null
    banned?: boolean | null
    banReason?: string | null
    banExpires?: Date | string | null
    subscribed?: boolean | null
    finishOnboarding?: boolean | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    payment?: PaymentUncheckedCreateNestedManyWithoutUserInput
    userOnboarding?: UserOnboardingUncheckedCreateNestedOneWithoutUserInput
    galleries?: GalleryUncheckedCreateNestedManyWithoutUserInput
    storageEvents?: StorageEventUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutClientsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutClientsInput, UserUncheckedCreateWithoutClientsInput>
  }

  export type GalleryClientCreateWithoutClientInput = {
    createdAt?: Date | string
    gallery: GalleryCreateNestedOneWithoutClientsInput
  }

  export type GalleryClientUncheckedCreateWithoutClientInput = {
    galleryId: string
    createdAt?: Date | string
  }

  export type GalleryClientCreateOrConnectWithoutClientInput = {
    where: GalleryClientWhereUniqueInput
    create: XOR<GalleryClientCreateWithoutClientInput, GalleryClientUncheckedCreateWithoutClientInput>
  }

  export type GalleryClientCreateManyClientInputEnvelope = {
    data: GalleryClientCreateManyClientInput | GalleryClientCreateManyClientInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutClientsInput = {
    update: XOR<UserUpdateWithoutClientsInput, UserUncheckedUpdateWithoutClientsInput>
    create: XOR<UserCreateWithoutClientsInput, UserUncheckedCreateWithoutClientsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutClientsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutClientsInput, UserUncheckedUpdateWithoutClientsInput>
  }

  export type UserUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
    accounts?: AccountUpdateManyWithoutUserNestedInput
    payment?: PaymentUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUpdateOneWithoutUserNestedInput
    galleries?: GalleryUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    plan?: EnumPlanFieldUpdateOperationsInput | $Enums.Plan
    storageUsed?: BigIntFieldUpdateOperationsInput | bigint | number
    storageLimit?: BigIntFieldUpdateOperationsInput | bigint | number
    overageBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    overageResetAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubId?: NullableStringFieldUpdateOperationsInput | string | null
    warningEmailSent80?: BoolFieldUpdateOperationsInput | boolean
    warningEmailSent95?: BoolFieldUpdateOperationsInput | boolean
    emailVerified?: BoolFieldUpdateOperationsInput | boolean
    image?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    banned?: NullableBoolFieldUpdateOperationsInput | boolean | null
    banReason?: NullableStringFieldUpdateOperationsInput | string | null
    banExpires?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscribed?: NullableBoolFieldUpdateOperationsInput | boolean | null
    finishOnboarding?: NullableBoolFieldUpdateOperationsInput | boolean | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    payment?: PaymentUncheckedUpdateManyWithoutUserNestedInput
    userOnboarding?: UserOnboardingUncheckedUpdateOneWithoutUserNestedInput
    galleries?: GalleryUncheckedUpdateManyWithoutUserNestedInput
    storageEvents?: StorageEventUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GalleryClientUpsertWithWhereUniqueWithoutClientInput = {
    where: GalleryClientWhereUniqueInput
    update: XOR<GalleryClientUpdateWithoutClientInput, GalleryClientUncheckedUpdateWithoutClientInput>
    create: XOR<GalleryClientCreateWithoutClientInput, GalleryClientUncheckedCreateWithoutClientInput>
  }

  export type GalleryClientUpdateWithWhereUniqueWithoutClientInput = {
    where: GalleryClientWhereUniqueInput
    data: XOR<GalleryClientUpdateWithoutClientInput, GalleryClientUncheckedUpdateWithoutClientInput>
  }

  export type GalleryClientUpdateManyWithWhereWithoutClientInput = {
    where: GalleryClientScalarWhereInput
    data: XOR<GalleryClientUpdateManyMutationInput, GalleryClientUncheckedUpdateManyWithoutClientInput>
  }

  export type GalleryCreateWithoutClientsInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGalleriesInput
    coverPhoto?: PhotoCreateNestedOneWithoutUsedAsCoverInInput
    photos?: PhotoCreateNestedManyWithoutGalleryInput
    albums?: AlbumCreateNestedManyWithoutGalleryInput
  }

  export type GalleryUncheckedCreateWithoutClientsInput = {
    id?: string
    userId: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    coverPhotoId?: string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutGalleryInput
    albums?: AlbumUncheckedCreateNestedManyWithoutGalleryInput
  }

  export type GalleryCreateOrConnectWithoutClientsInput = {
    where: GalleryWhereUniqueInput
    create: XOR<GalleryCreateWithoutClientsInput, GalleryUncheckedCreateWithoutClientsInput>
  }

  export type ClientCreateWithoutGalleriesInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutClientsInput
  }

  export type ClientUncheckedCreateWithoutGalleriesInput = {
    id?: string
    userId: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientCreateOrConnectWithoutGalleriesInput = {
    where: ClientWhereUniqueInput
    create: XOR<ClientCreateWithoutGalleriesInput, ClientUncheckedCreateWithoutGalleriesInput>
  }

  export type GalleryUpsertWithoutClientsInput = {
    update: XOR<GalleryUpdateWithoutClientsInput, GalleryUncheckedUpdateWithoutClientsInput>
    create: XOR<GalleryCreateWithoutClientsInput, GalleryUncheckedCreateWithoutClientsInput>
    where?: GalleryWhereInput
  }

  export type GalleryUpdateToOneWithWhereWithoutClientsInput = {
    where?: GalleryWhereInput
    data: XOR<GalleryUpdateWithoutClientsInput, GalleryUncheckedUpdateWithoutClientsInput>
  }

  export type GalleryUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGalleriesNestedInput
    coverPhoto?: PhotoUpdateOneWithoutUsedAsCoverInNestedInput
    photos?: PhotoUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateWithoutClientsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coverPhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUncheckedUpdateManyWithoutGalleryNestedInput
  }

  export type ClientUpsertWithoutGalleriesInput = {
    update: XOR<ClientUpdateWithoutGalleriesInput, ClientUncheckedUpdateWithoutGalleriesInput>
    create: XOR<ClientCreateWithoutGalleriesInput, ClientUncheckedCreateWithoutGalleriesInput>
    where?: ClientWhereInput
  }

  export type ClientUpdateToOneWithWhereWithoutGalleriesInput = {
    where?: ClientWhereInput
    data: XOR<ClientUpdateWithoutGalleriesInput, ClientUncheckedUpdateWithoutGalleriesInput>
  }

  export type ClientUpdateWithoutGalleriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutClientsNestedInput
  }

  export type ClientUncheckedUpdateWithoutGalleriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryCreateWithoutAlbumsInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutGalleriesInput
    coverPhoto?: PhotoCreateNestedOneWithoutUsedAsCoverInInput
    photos?: PhotoCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientCreateNestedManyWithoutGalleryInput
  }

  export type GalleryUncheckedCreateWithoutAlbumsInput = {
    id?: string
    userId: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    coverPhotoId?: string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutGalleryInput
    clients?: GalleryClientUncheckedCreateNestedManyWithoutGalleryInput
  }

  export type GalleryCreateOrConnectWithoutAlbumsInput = {
    where: GalleryWhereUniqueInput
    create: XOR<GalleryCreateWithoutAlbumsInput, GalleryUncheckedCreateWithoutAlbumsInput>
  }

  export type AlbumPhotoCreateWithoutAlbumInput = {
    createdAt?: Date | string
    photo: PhotoCreateNestedOneWithoutAlbumPhotosInput
  }

  export type AlbumPhotoUncheckedCreateWithoutAlbumInput = {
    photoId: string
    createdAt?: Date | string
  }

  export type AlbumPhotoCreateOrConnectWithoutAlbumInput = {
    where: AlbumPhotoWhereUniqueInput
    create: XOR<AlbumPhotoCreateWithoutAlbumInput, AlbumPhotoUncheckedCreateWithoutAlbumInput>
  }

  export type AlbumPhotoCreateManyAlbumInputEnvelope = {
    data: AlbumPhotoCreateManyAlbumInput | AlbumPhotoCreateManyAlbumInput[]
    skipDuplicates?: boolean
  }

  export type GalleryUpsertWithoutAlbumsInput = {
    update: XOR<GalleryUpdateWithoutAlbumsInput, GalleryUncheckedUpdateWithoutAlbumsInput>
    create: XOR<GalleryCreateWithoutAlbumsInput, GalleryUncheckedCreateWithoutAlbumsInput>
    where?: GalleryWhereInput
  }

  export type GalleryUpdateToOneWithWhereWithoutAlbumsInput = {
    where?: GalleryWhereInput
    data: XOR<GalleryUpdateWithoutAlbumsInput, GalleryUncheckedUpdateWithoutAlbumsInput>
  }

  export type GalleryUpdateWithoutAlbumsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGalleriesNestedInput
    coverPhoto?: PhotoUpdateOneWithoutUsedAsCoverInNestedInput
    photos?: PhotoUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateWithoutAlbumsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coverPhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUncheckedUpdateManyWithoutGalleryNestedInput
  }

  export type AlbumPhotoUpsertWithWhereUniqueWithoutAlbumInput = {
    where: AlbumPhotoWhereUniqueInput
    update: XOR<AlbumPhotoUpdateWithoutAlbumInput, AlbumPhotoUncheckedUpdateWithoutAlbumInput>
    create: XOR<AlbumPhotoCreateWithoutAlbumInput, AlbumPhotoUncheckedCreateWithoutAlbumInput>
  }

  export type AlbumPhotoUpdateWithWhereUniqueWithoutAlbumInput = {
    where: AlbumPhotoWhereUniqueInput
    data: XOR<AlbumPhotoUpdateWithoutAlbumInput, AlbumPhotoUncheckedUpdateWithoutAlbumInput>
  }

  export type AlbumPhotoUpdateManyWithWhereWithoutAlbumInput = {
    where: AlbumPhotoScalarWhereInput
    data: XOR<AlbumPhotoUpdateManyMutationInput, AlbumPhotoUncheckedUpdateManyWithoutAlbumInput>
  }

  export type AlbumCreateWithoutPhotosInput = {
    id?: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    gallery: GalleryCreateNestedOneWithoutAlbumsInput
  }

  export type AlbumUncheckedCreateWithoutPhotosInput = {
    id?: string
    galleryId: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlbumCreateOrConnectWithoutPhotosInput = {
    where: AlbumWhereUniqueInput
    create: XOR<AlbumCreateWithoutPhotosInput, AlbumUncheckedCreateWithoutPhotosInput>
  }

  export type PhotoCreateWithoutAlbumPhotosInput = {
    id?: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    gallery: GalleryCreateNestedOneWithoutPhotosInput
    usedAsCoverIn?: GalleryCreateNestedManyWithoutCoverPhotoInput
  }

  export type PhotoUncheckedCreateWithoutAlbumPhotosInput = {
    id?: string
    galleryId: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
    usedAsCoverIn?: GalleryUncheckedCreateNestedManyWithoutCoverPhotoInput
  }

  export type PhotoCreateOrConnectWithoutAlbumPhotosInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutAlbumPhotosInput, PhotoUncheckedCreateWithoutAlbumPhotosInput>
  }

  export type AlbumUpsertWithoutPhotosInput = {
    update: XOR<AlbumUpdateWithoutPhotosInput, AlbumUncheckedUpdateWithoutPhotosInput>
    create: XOR<AlbumCreateWithoutPhotosInput, AlbumUncheckedCreateWithoutPhotosInput>
    where?: AlbumWhereInput
  }

  export type AlbumUpdateToOneWithWhereWithoutPhotosInput = {
    where?: AlbumWhereInput
    data: XOR<AlbumUpdateWithoutPhotosInput, AlbumUncheckedUpdateWithoutPhotosInput>
  }

  export type AlbumUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gallery?: GalleryUpdateOneRequiredWithoutAlbumsNestedInput
  }

  export type AlbumUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    galleryId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUpsertWithoutAlbumPhotosInput = {
    update: XOR<PhotoUpdateWithoutAlbumPhotosInput, PhotoUncheckedUpdateWithoutAlbumPhotosInput>
    create: XOR<PhotoCreateWithoutAlbumPhotosInput, PhotoUncheckedCreateWithoutAlbumPhotosInput>
    where?: PhotoWhereInput
  }

  export type PhotoUpdateToOneWithWhereWithoutAlbumPhotosInput = {
    where?: PhotoWhereInput
    data: XOR<PhotoUpdateWithoutAlbumPhotosInput, PhotoUncheckedUpdateWithoutAlbumPhotosInput>
  }

  export type PhotoUpdateWithoutAlbumPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gallery?: GalleryUpdateOneRequiredWithoutPhotosNestedInput
    usedAsCoverIn?: GalleryUpdateManyWithoutCoverPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutAlbumPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    galleryId?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAsCoverIn?: GalleryUncheckedUpdateManyWithoutCoverPhotoNestedInput
  }

  export type SessionCreateManyUserInput = {
    id?: string
    expiresAt: Date | string
    token: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ipAddress?: string | null
    userAgent?: string | null
    impersonatedBy?: string | null
  }

  export type AccountCreateManyUserInput = {
    id?: string
    accountId: string
    providerId: string
    accessToken?: string | null
    refreshToken?: string | null
    idToken?: string | null
    accessTokenExpiresAt?: Date | string | null
    refreshTokenExpiresAt?: Date | string | null
    scope?: string | null
    password?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PaymentCreateManyUserInput = {
    id?: number
    planId: number
    plan: $Enums.PlanType
    planExpiresAt?: Date | string | null
    planStartedAt?: Date | string | null
    amount_cents: number
    transactionId: number
    initial_transaction: number
    subscriptionId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    status: $Enums.SubscriptionStatus
  }

  export type GalleryCreateManyUserInput = {
    id?: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    coverPhotoId?: string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ClientCreateManyUserInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StorageEventCreateManyUserInput = {
    id?: string
    photoId?: string | null
    delta: bigint | number
    reason: string
    createdAt?: Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    impersonatedBy?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    accountId?: StringFieldUpdateOperationsInput | string
    providerId?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    refreshTokenExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentUpdateWithoutUserInput = {
    planId?: IntFieldUpdateOperationsInput | number
    plan?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    planExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount_cents?: IntFieldUpdateOperationsInput | number
    transactionId?: IntFieldUpdateOperationsInput | number
    initial_transaction?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
  }

  export type PaymentUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    plan?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    planExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount_cents?: IntFieldUpdateOperationsInput | number
    transactionId?: IntFieldUpdateOperationsInput | number
    initial_transaction?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
  }

  export type PaymentUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    planId?: IntFieldUpdateOperationsInput | number
    plan?: EnumPlanTypeFieldUpdateOperationsInput | $Enums.PlanType
    planExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    planStartedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    amount_cents?: IntFieldUpdateOperationsInput | number
    transactionId?: IntFieldUpdateOperationsInput | number
    initial_transaction?: IntFieldUpdateOperationsInput | number
    subscriptionId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
  }

  export type GalleryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    coverPhoto?: PhotoUpdateOneWithoutUsedAsCoverInNestedInput
    photos?: PhotoUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coverPhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUncheckedUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUncheckedUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    coverPhotoId?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ClientUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    galleries?: GalleryClientUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    galleries?: GalleryClientUncheckedUpdateManyWithoutClientNestedInput
  }

  export type ClientUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageEventUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: NullableStringFieldUpdateOperationsInput | string | null
    delta?: BigIntFieldUpdateOperationsInput | bigint | number
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageEventUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: NullableStringFieldUpdateOperationsInput | string | null
    delta?: BigIntFieldUpdateOperationsInput | bigint | number
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StorageEventUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: NullableStringFieldUpdateOperationsInput | string | null
    delta?: BigIntFieldUpdateOperationsInput | bigint | number
    reason?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoCreateManyGalleryInput = {
    id?: string
    s3Key: string
    s3Bucket: string
    originalFilename: string
    originalSize?: bigint | number
    thumbnailSize?: bigint | number
    previewSize?: bigint | number
    totalSize?: bigint | number
    width?: number | null
    height?: number | null
    mimeType: string
    order?: number
    isCulled?: boolean
    loved?: boolean
    aiCaption?: string | null
    aiTags?: PhotoCreateaiTagsInput | string[]
    faceCount?: number
    thumbnailKey?: string | null
    previewKey?: string | null
    status?: string
    createdAt?: Date | string
  }

  export type AlbumCreateManyGalleryInput = {
    id?: string
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GalleryClientCreateManyGalleryInput = {
    clientId: string
    createdAt?: Date | string
  }

  export type PhotoUpdateWithoutGalleryInput = {
    id?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAsCoverIn?: GalleryUpdateManyWithoutCoverPhotoNestedInput
    albumPhotos?: AlbumPhotoUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutGalleryInput = {
    id?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAsCoverIn?: GalleryUncheckedUpdateManyWithoutCoverPhotoNestedInput
    albumPhotos?: AlbumPhotoUncheckedUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateManyWithoutGalleryInput = {
    id?: StringFieldUpdateOperationsInput | string
    s3Key?: StringFieldUpdateOperationsInput | string
    s3Bucket?: StringFieldUpdateOperationsInput | string
    originalFilename?: StringFieldUpdateOperationsInput | string
    originalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    thumbnailSize?: BigIntFieldUpdateOperationsInput | bigint | number
    previewSize?: BigIntFieldUpdateOperationsInput | bigint | number
    totalSize?: BigIntFieldUpdateOperationsInput | bigint | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    isCulled?: BoolFieldUpdateOperationsInput | boolean
    loved?: BoolFieldUpdateOperationsInput | boolean
    aiCaption?: NullableStringFieldUpdateOperationsInput | string | null
    aiTags?: PhotoUpdateaiTagsInput | string[]
    faceCount?: IntFieldUpdateOperationsInput | number
    thumbnailKey?: NullableStringFieldUpdateOperationsInput | string | null
    previewKey?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumUpdateWithoutGalleryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: AlbumPhotoUpdateManyWithoutAlbumNestedInput
  }

  export type AlbumUncheckedUpdateWithoutGalleryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: AlbumPhotoUncheckedUpdateManyWithoutAlbumNestedInput
  }

  export type AlbumUncheckedUpdateManyWithoutGalleryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryClientUpdateWithoutGalleryInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    client?: ClientUpdateOneRequiredWithoutGalleriesNestedInput
  }

  export type GalleryClientUncheckedUpdateWithoutGalleryInput = {
    clientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryClientUncheckedUpdateManyWithoutGalleryInput = {
    clientId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryCreateManyCoverPhotoInput = {
    id?: string
    userId: string
    title: string
    slug: string
    eventDate?: Date | string | null
    deadline?: Date | string | null
    passwordHash?: string | null
    shareToken?: string
    isPublished?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AlbumPhotoCreateManyPhotoInput = {
    albumId: string
    createdAt?: Date | string
  }

  export type GalleryUpdateWithoutCoverPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutGalleriesNestedInput
    photos?: PhotoUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateWithoutCoverPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutGalleryNestedInput
    albums?: AlbumUncheckedUpdateManyWithoutGalleryNestedInput
    clients?: GalleryClientUncheckedUpdateManyWithoutGalleryNestedInput
  }

  export type GalleryUncheckedUpdateManyWithoutCoverPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    eventDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deadline?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    shareToken?: StringFieldUpdateOperationsInput | string
    isPublished?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoUpdateWithoutPhotoInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    album?: AlbumUpdateOneRequiredWithoutPhotosNestedInput
  }

  export type AlbumPhotoUncheckedUpdateWithoutPhotoInput = {
    albumId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoUncheckedUpdateManyWithoutPhotoInput = {
    albumId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryClientCreateManyClientInput = {
    galleryId: string
    createdAt?: Date | string
  }

  export type GalleryClientUpdateWithoutClientInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    gallery?: GalleryUpdateOneRequiredWithoutClientsNestedInput
  }

  export type GalleryClientUncheckedUpdateWithoutClientInput = {
    galleryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GalleryClientUncheckedUpdateManyWithoutClientInput = {
    galleryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoCreateManyAlbumInput = {
    photoId: string
    createdAt?: Date | string
  }

  export type AlbumPhotoUpdateWithoutAlbumInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photo?: PhotoUpdateOneRequiredWithoutAlbumPhotosNestedInput
  }

  export type AlbumPhotoUncheckedUpdateWithoutAlbumInput = {
    photoId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AlbumPhotoUncheckedUpdateManyWithoutAlbumInput = {
    photoId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}