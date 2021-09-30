import { Session, SessionID, SessionInfo } from "./session";
import { Account, AccountID } from "./account";
import { Vault, VaultID } from "./vault";
import { Org, OrgID } from "./org";
import { Invite, InviteID } from "./invite";
import { Serializable, SerializableConstructor, AsBytes, AsSerializable } from "./encoding";
import { Attachment, AttachmentID } from "./attachment";
import { PBKDF2Params } from "./crypto";
import { PBES2Container } from "./container";
import { RequestProgress } from "./transport";
import { AuthPurpose, AuthType, AuthenticatorInfo, Auth, AccountStatus, AuthRequestStatus } from "./auth";
import { KeyStoreEntry, KeyStoreEntryInfo } from "./key-store";
import { DeviceInfo } from "./platform";
import { Provisioning, ProvisioningStatus } from "./provisioning";

/**
 * Api parameters for creating a new Account to be used with [[API.createAccount]].
 */
export class CreateAccountParams extends Serializable {
    /** The [[Account]] object containing the relevant information */
    @AsSerializable(Account)
    account!: Account;

    /**
     * An [[Auth]] object container the verifier and authentication params
     * required for subsequent authentication
     */
    @AsSerializable(Auth)
    auth!: Auth;

    /**
     * The verification token obtained from [[API.completeAuthRequest]].
     */
    verify: string = "";

    /**
     * The corresponding [[InviteID]] and [[OrgID]] if signup was initiated
     * through an invite link.
     *
     * @optional
     */
    invite?: {
        id: InviteID;
        org: OrgID;
    } = undefined;

    constructor(props?: Partial<CreateAccountParams>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * Parameters for initiating account recovery to be used with [[API.recoverAccount]]
 */
export class RecoverAccountParams extends Serializable {
    /** The newly initialized [[Account]] object */
    @AsSerializable(Account)
    account!: Account;

    /** The new authentication parameters */
    @AsSerializable(Auth)
    auth!: Auth;

    /** An email verification token obtained from [[API.completeEmailVerification]] */
    verify: string = "";

    constructor(props?: Partial<RecoverAccountParams>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * Parameters for requesting Multi-Factor Authenticatino via [[API.requestMFACode]]
 * @deprecated
 */
export class RequestMFACodeParams extends Serializable {
    /** The accounts email address */
    email = "";

    /** The purpose of the email verification */
    purpose: AuthPurpose = AuthPurpose.Login;

    type: AuthType = AuthType.Email;

    constructor(props?: Partial<RequestMFACodeParams>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * Parameters for retrieving MFA token via [[API.retrieveMFAToken]]
 * @deprecated since v4.0. Please use [[CompleteMFARequestParams]].
 */
export class RetrieveMFATokenParams extends Serializable {
    /** The email address to be verified */
    email: string = "";

    /**
     * The verification code received via email after calling [[API.requestEmailVerification]]
     * */
    code: string = "";

    /** Parameters need to verify authentication request */
    params: any;

    purpose: AuthPurpose = AuthPurpose.Login;

    constructor(props?: Partial<RetrieveMFATokenParams>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * @deprecated since v4.0. Please use [[CompleteMFARequestResponse]].
 */
export class RetrieveMFATokenResponse extends Serializable {
    /** The verification token which can be used to authenticate certain requests */
    token: string = "";

    /** Whether the user already has an account */
    hasAccount: boolean = false;

    /** Whether the user has a legacy account */
    hasLegacyAccount: boolean = false;

    /** Token for getting legacy data. */
    legacyToken?: string = undefined;

    constructor(props?: Partial<RetrieveMFATokenResponse>) {
        super();
        props && Object.assign(this, props);
    }
}

export class StartRegisterAuthenticatorParams extends Serializable {
    type: AuthType = AuthType.Email;

    purposes: AuthPurpose[] = [AuthPurpose.Signup, AuthPurpose.Login, AuthPurpose.Recover];

    data: any = {};

    @AsSerializable(DeviceInfo)
    device?: DeviceInfo;

    constructor(props?: Partial<StartRegisterAuthenticatorParams>) {
        super();
        props && Object.assign(this, props);
    }
}

export class StartRegisterAuthenticatorResponse extends Serializable {
    id: string = "";

    type: AuthType = AuthType.Email;

    data: any = {};

    constructor(props?: Partial<StartRegisterAuthenticatorResponse>) {
        super();
        props && Object.assign(this, props);
    }
}

export class CompleteRegisterMFAuthenticatorParams extends Serializable {
    id: string = "";

    data: any = {};

    constructor(props?: Partial<CompleteRegisterMFAuthenticatorParams>) {
        super();
        props && Object.assign(this, props);
    }
}

export class CompleteRegisterMFAuthenticatorResponse extends Serializable {
    id: string = "";

    data: any = {};

    constructor(props?: Partial<CompleteRegisterMFAuthenticatorResponse>) {
        super();
        props && Object.assign(this, props);
    }
}

export class StartAuthRequestParams extends Serializable {
    email: string = "";

    type?: AuthType = undefined;

    authenticatorId?: string = undefined;

    authenticatorIndex?: number = undefined;

    supportedTypes?: AuthType[];

    purpose: AuthPurpose = AuthPurpose.Login;

    data: any = {};

    constructor(props?: Partial<StartAuthRequestParams>) {
        super();
        props && Object.assign(this, props);
    }
}

export class StartAuthRequestResponse extends Serializable {
    id: string = "";

    token: string = "";

    data: any = {};

    type: AuthType = AuthType.Email;

    authenticatorId: string = "";

    requestStatus: AuthRequestStatus = AuthRequestStatus.Started;

    accountStatus?: AccountStatus = undefined;

    provisioningStatus?: ProvisioningStatus = undefined;

    provisioningMessage?: string = undefined;

    deviceTrusted = false;

    constructor(props?: Partial<StartAuthRequestResponse>) {
        super();
        props && Object.assign(this, props);
    }
}

export class CompleteAuthRequestParams extends Serializable {
    email: string = "";

    id: string = "";

    data: any = {};

    constructor(props?: Partial<CompleteAuthRequestParams>) {
        super();
        props && Object.assign(this, props);
    }
}

export class CompleteAuthRequestResponse extends Serializable {
    accountStatus: AccountStatus = AccountStatus.Unregistered;

    deviceTrusted = false;

    provisioningStatus: ProvisioningStatus = ProvisioningStatus.Active;

    provisioningMessage: string = "";

    constructor(props?: Partial<CompleteAuthRequestResponse>) {
        super();
        props && Object.assign(this, props);
    }
}

export class CompleteMFARequestResponse extends Serializable {
    constructor(props?: Partial<CompleteMFARequestResponse>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * Parameters for initiating authentication through [[API.initAuth]]
 */
export class InitAuthParams extends Serializable {
    /** The email address of the [[Account]] in question */
    email = "";

    /**
     * The verification token obtained from [[API.retrieveMFAToken]].
     */
    verify?: string = undefined;

    constructor(props?: Partial<InitAuthParams>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * The response object received from [[API.initAuth]]
 */
export class InitAuthResponse extends Serializable {
    /** The account id */
    account: AccountID = "";

    /** The id of the current SRP flow */
    srpId: string = "";

    /** The key derivation parameters used for authentication */
    @AsSerializable(PBKDF2Params)
    keyParams: PBKDF2Params = new PBKDF2Params();

    /** A random value used for SRP session negotiation */
    @AsBytes()
    B!: Uint8Array;

    constructor(props?: Partial<InitAuthResponse>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * Parameters for creating a new [[Session]] through [[API.createSession]]
 */
export class CreateSessionParams extends Serializable {
    srpId: string = "";

    /** The id of the [[Account]] to create the session for */
    account: AccountID = "";

    /** Verification value used for SRP session negotiation */
    @AsBytes()
    M!: Uint8Array;

    /** Random value used form SRP session negotiation */
    @AsBytes()
    A!: Uint8Array;

    addTrustedDevice: boolean = false;

    constructor(props?: Partial<CreateSessionParams>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * Parameters for fetching an [[Invite]]
 */
export class GetInviteParams extends Serializable {
    /** The organization id */
    org: OrgID = "";

    /** The invite id */
    id: InviteID = "";

    constructor(props?: Partial<GetInviteParams>) {
        super();
        props && Object.assign(this, props);
    }
}

/**
 * Parameters for fetching an [[Attachment]]
 */
export class GetAttachmentParams extends Serializable {
    /** The vault id */
    vault: VaultID = "";

    /** The attachment id */
    id: AttachmentID = "";

    constructor(props?: Partial<GetAttachmentParams>) {
        super();
        props && Object.assign(this, props);
    }
}

export class DeleteAttachmentParams extends GetAttachmentParams {}

export class GetLegacyDataParams extends Serializable {
    constructor(vals: Partial<GetLegacyDataParams> = {}) {
        super();
        Object.assign(this, vals);
    }

    email: string = "";
    verify?: string = undefined;
}

export class CreateKeyStoreEntryParams extends Serializable {
    constructor(vals: Partial<CreateKeyStoreEntryParams> = {}) {
        super();
        Object.assign(this, vals);
    }

    @AsBytes()
    data!: Uint8Array;

    authenticatorId: string = "";
}

export class GetKeyStoreEntryParams extends Serializable {
    constructor(vals: Partial<GetKeyStoreEntryParams> = {}) {
        super();
        Object.assign(this, vals);
    }

    id: string = "";

    mfaToken: string = "";
}

export class AuthInfo extends Serializable {
    constructor(vals: Partial<AuthInfo> = {}) {
        super();
        Object.assign(this, vals);
    }

    @AsSerializable(DeviceInfo)
    trustedDevices: DeviceInfo[] = [];

    @AsSerializable(AuthenticatorInfo)
    authenticators: AuthenticatorInfo[] = [];

    mfaOrder: string[] = [];

    @AsSerializable(SessionInfo)
    sessions: SessionInfo[] = [];

    @AsSerializable(KeyStoreEntryInfo)
    keyStoreEntries: KeyStoreEntryInfo[] = [];

    @AsSerializable(Provisioning)
    provisioning!: Provisioning;

    invites: {
        id: string;
        orgId: string;
        orgName: string;
    }[] = [];
}

export class UpdateAuthParams extends Serializable {
    constructor(vals: Partial<UpdateAuthParams> = {}) {
        super();
        Object.assign(this, vals);
    }

    /** Verifier used for SRP session negotiation */
    @AsBytes()
    verifier?: Uint8Array;

    /**
     * Key derivation params used by the client to compute session key from the
     * users master password
     * */
    @AsSerializable(PBKDF2Params)
    keyParams?: PBKDF2Params;

    mfaOrder?: string[] = undefined;
}

interface HandlerDefinition {
    method: string;
    input?: SerializableConstructor;
    output?: SerializableConstructor;
}

/**
 * Decorator for defining request handler methods
 */
function Handler(
    input: SerializableConstructor | StringConstructor | undefined,
    output: SerializableConstructor | StringConstructor | undefined
) {
    return (proto: API, method: string) => {
        if (!proto.handlerDefinitions) {
            proto.handlerDefinitions = [];
        }
        proto.handlerDefinitions.push({
            method,
            input: input === String ? undefined : (input as SerializableConstructor | undefined),
            output: output === String ? undefined : (output as SerializableConstructor | undefined),
        });
    };
}

export type PromiseWithProgress<T> = Promise<T> & { progress?: RequestProgress };

/**
 * Transport-agnostic interface defining communication
 * between [[Client]] and [[Server]] instances.
 */
export class API {
    handlerDefinitions!: HandlerDefinition[];

    @Handler(StartRegisterAuthenticatorParams, StartRegisterAuthenticatorResponse)
    startRegisterAuthenticator(
        _params: StartRegisterAuthenticatorParams
    ): PromiseWithProgress<StartRegisterAuthenticatorResponse> {
        throw "Not implemented";
    }

    @Handler(CompleteRegisterMFAuthenticatorParams, CompleteRegisterMFAuthenticatorResponse)
    completeRegisterAuthenticator(
        _params: CompleteRegisterMFAuthenticatorParams
    ): PromiseWithProgress<CompleteRegisterMFAuthenticatorResponse> {
        throw "Not implemented";
    }

    @Handler(String, undefined)
    deleteAuthenticator(_id: string): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    @Handler(StartAuthRequestParams, StartAuthRequestResponse)
    startAuthRequest(_params: StartAuthRequestParams): PromiseWithProgress<StartAuthRequestResponse> {
        throw "Not implemented";
    }

    @Handler(CompleteAuthRequestParams, CompleteAuthRequestResponse)
    completeAuthRequest(_params: CompleteAuthRequestParams): PromiseWithProgress<CompleteAuthRequestResponse> {
        throw "Not implemented";
    }

    /**
     * Request verification of a given email address. This will send a verification code
     * to the email in question which can then be exchanged for a verification token via
     * [[completeEmailVerification]].
     * @deprecated since v4.0. Please use [[startAuthRequest]] instead
     */
    @Handler(RequestMFACodeParams, undefined)
    requestMFACode(_params: RequestMFACodeParams): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    /**
     * Complete the email verification process by providing a verification code received
     * via email. Returns a verification token that can be used in other api calls like
     * [[createAccount]] or [[recoverAccount]].
     * @deprecated since v4.0. Please use [[completeAuthRequest]] instead
     */
    @Handler(RetrieveMFATokenParams, RetrieveMFATokenResponse)
    retrieveMFAToken(_params: RetrieveMFATokenParams): PromiseWithProgress<RetrieveMFATokenResponse> {
        throw "Not implemented";
    }

    /**
     * Initiate the login procedure for a given account by requesting the authentication params
     * which are required for proceeding with [[createSession]].
     */
    @Handler(InitAuthParams, InitAuthResponse)
    initAuth(_params: InitAuthParams): PromiseWithProgress<InitAuthResponse> {
        throw "Not implemented";
    }

    /**
     * Update the authentication params stored on the server. This is usually used
     * in case a users master password has changed.
     */
    @Handler(UpdateAuthParams, undefined)
    updateAuth(_params: UpdateAuthParams): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    /**
     * Create new [[Session]] which can be used to authenticate future request
     */
    @Handler(CreateSessionParams, Session)
    createSession(_params: CreateSessionParams): PromiseWithProgress<Session> {
        throw "Not implemented";
    }

    /**
     * Revoke a [[Session]], effectively logging out any client authenticated with it
     */
    @Handler(String, undefined)
    revokeSession(_id: SessionID): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    /**
     * Create a new [[Account]]
     */
    @Handler(CreateAccountParams, Account)
    createAccount(_params: CreateAccountParams): PromiseWithProgress<Account> {
        throw "Not implemented";
    }

    /**
     * Get the [[Account]] associated with the current session
     *
     * @authentication_required
     */
    @Handler(undefined, Account)
    getAccount(): PromiseWithProgress<Account> {
        throw "Not implemented";
    }

    /** Get the [[AuthInfo]] for the current account **/
    @Handler(undefined, AuthInfo)
    getAuthInfo(): Promise<AuthInfo> {
        throw "Not implemented";
    }

    /**
     * Update the [[Account]] associated with the current session.
     *
     * @authentication_required
     */
    @Handler(Account, Account)
    updateAccount(_account: Account): PromiseWithProgress<Account> {
        throw "Not implemented";
    }

    /**
     * Initiate account recovery
     */
    @Handler(RecoverAccountParams, Account)
    recoverAccount(_params: RecoverAccountParams): PromiseWithProgress<Account> {
        throw "Not implemented";
    }

    /**
     * Delete current account
     */
    @Handler(undefined, undefined)
    deleteAccount(): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    /**
     * Create a new [[Org]]
     *
     * @authentication_required
     */
    @Handler(Org, Org)
    createOrg(_params: Org): PromiseWithProgress<Org> {
        throw "Not implemented";
    }

    /**
     * Get the [[Org]] for a given `id`.
     *
     * @authentication_required
     *
     * Requires the authenticated account to be a member of the given organization
     */
    @Handler(undefined, Org)
    getOrg(_id: OrgID): PromiseWithProgress<Org> {
        throw "Not implemented";
    }

    /**
     * Updates a given [[Org]]
     *
     * @authentication_required
     *
     * Updating members, organization name or pubic/private keys requires the [[OrgRole.Owner]]
     * role, while any other changes require the [[OrgRole.Admin]] role.
     */
    @Handler(Org, Org)
    updateOrg(_org: Org): PromiseWithProgress<Org> {
        throw "Not implemented";
    }

    @Handler(String, undefined)
    deleteOrg(_id: OrgID): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    /**
     * Create a new vault
     *
     * @authentication_required
     *
     * Requires the [[OrgRole.Admin]] role on the associated organization
     */
    @Handler(Vault, Vault)
    createVault(_vault: Vault): PromiseWithProgress<Vault> {
        throw "Not implemented";
    }

    /**
     * Get the [[Vault]] with the given `id`
     *
     * @authentiation_required
     *
     * If the vault belongs to an organization, the authenticated account needs to
     * be assigned to the given vault either directly or through a [[Group]].
     * Otherwise, only access to the accounts private vault is allowed.
     */
    @Handler(String, Vault)
    getVault(_id: VaultID): PromiseWithProgress<Vault> {
        throw "Not implemented";
    }

    /**
     * Update the given [[Vault]]
     *
     * @authentiation_required
     *
     * If vault belongs to an organization, the authenticated account needs to
     * be be assigned to the given vault either directly or through a [[Group]]
     * and have explicit write access. Otherwise, only access to the accounts
     * private vault is allowed.
     */
    @Handler(Vault, Vault)
    updateVault(_vault: Vault): PromiseWithProgress<Vault> {
        throw "Not implemented";
    }

    /**
     * Delete the [[Vault]] with the given `id`
     *
     * @authentication_required
     *
     * Requires at least the [[OrgRole.Admin]] role on the organization the vault
     * belongs to. Private vaults cannot be deleted.
     */
    @Handler(String, undefined)
    deleteVault(_id: VaultID): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    /**
     * Get an [[Invite]].
     *
     * @authentication_required
     *
     * Requires the authenticated account to either be an [[OrgRole.Owner]] of
     * the associated organization or the recipient of the invite.
     */
    @Handler(GetInviteParams, Invite)
    getInvite(_params: GetInviteParams): PromiseWithProgress<Invite> {
        throw "Not implemented";
    }

    /**
     * Accept an [[Invite]]
     *
     * @authentication_required
     *
     * Requires the authenticated account to be the recipient of the invite.
     */
    @Handler(Invite, undefined)
    acceptInvite(_invite: Invite): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    @Handler(Attachment, String)
    createAttachment(_attachment: Attachment): PromiseWithProgress<AttachmentID> {
        throw "Not implemented";
    }

    @Handler(GetAttachmentParams, Attachment)
    getAttachment(_attachment: GetAttachmentParams): PromiseWithProgress<Attachment> {
        throw "Not implemented";
    }

    @Handler(DeleteAttachmentParams, undefined)
    deleteAttachment(_attachment: DeleteAttachmentParams): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    @Handler(GetLegacyDataParams, PBES2Container)
    getLegacyData(_params: GetLegacyDataParams): PromiseWithProgress<PBES2Container> {
        throw "Not implemented";
    }

    @Handler(undefined, undefined)
    deleteLegacyAccount(): PromiseWithProgress<void> {
        throw "Not implemented";
    }

    @Handler(CreateKeyStoreEntryParams, KeyStoreEntry)
    createKeyStoreEntry(_params: CreateKeyStoreEntryParams): PromiseWithProgress<KeyStoreEntry> {
        throw "Not implemented";
    }

    @Handler(GetKeyStoreEntryParams, KeyStoreEntry)
    getKeyStoreEntry(_params: GetKeyStoreEntryParams): Promise<KeyStoreEntry> {
        throw "Not implemented";
    }

    @Handler(String, undefined)
    deleteKeyStoreEntry(_params: string): Promise<void> {
        throw "Not implemented";
    }

    // @Handler(GetMFAuthenticatorsParams, GetMFAuthenticatorsResponse)
    // getMFAuthenticators(_params: GetMFAuthenticatorsParams): Promise<GetMFAuthenticatorsResponse> {
    //     throw "Not implemented";
    // }

    @Handler(String, undefined)
    removeTrustedDevice(_id: string): PromiseWithProgress<void> {
        throw "Not implemented";
    }
}
