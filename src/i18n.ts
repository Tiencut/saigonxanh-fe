import { useSyncExternalStore, useCallback } from 'react';

const dictionary = {
  vi: {
    // Navigation / Modules
    workspace: 'KHÔNG GIAN LÀM VIỆC',
    items: 'Dữ liệu mẫu',
    files: 'Tệp của tôi',
    notifications: 'Thông báo',
    users: 'Người dùng',
    roles: 'Vai trò & quyền',
    audit: 'Nhật ký kiểm toán',
    legal: 'Nội dung pháp lý',
    settings: 'Cài đặt',
    system: 'Trạng thái hệ thống',
    'api-docs': 'Tài liệu API',
    jobs: 'Công việc nền',
    'privacy-requests': 'Yêu cầu dữ liệu cá nhân',
    profile: 'Hồ sơ & bảo mật',
    sessions: 'Thiết bị đăng nhập',
    activity: 'Hoạt động cá nhân',

    // Core actions
    add: 'Thêm mới',
    save: 'Lưu thay đổi',
    cancel: 'Hủy',
    search: 'Tìm kiếm',
    logout: 'Đăng xuất',
    login: 'Đăng nhập',
    register: 'Tạo tài khoản',
    edit: 'Sửa',
    delete: 'Xóa',
    confirm: 'Xác nhận',
    close: 'Đóng',
    back: 'Quay lại',
    restore: 'Khôi phục',
    deletePermanently: 'Xóa vĩnh viễn',
    markRead: 'Đánh dấu đã đọc',
    details: 'Chi tiết',
    revoke: 'Thu hồi',
    preview: 'Xem trước',
    retry: 'Thử lại',
    select: 'Chọn',

    // Common labels & fields
    email: 'Email',
    password: 'Mật khẩu',
    name: 'Họ và tên',
    title: 'Tiêu đề',
    description: 'Mô tả',
    actions: 'Thao tác',
    status: 'Trạng thái',
    created: 'Ngày tạo',
    createdAt: 'Thời gian',
    updatedAt: 'Cập nhật',
    active: 'Đang hoạt động',
    locked: 'Đã khóa',
    read: 'Đã đọc',
    unread: 'Chưa đọc',
    trash: 'Thùng rác',
    records: 'bản ghi',
    selected: 'đã chọn',
    deleteSelected: 'Xóa mục đã chọn',
    allStatuses: 'Tất cả trạng thái',
    version: 'Phiên bản',
    effectiveDate: 'Ngày hiệu lực',
    content: 'Nội dung',
    device: 'Thiết bị',
    signedIn: 'Đăng nhập lúc',
    currentDevice: 'Hiện tại',

    // States & hints
    empty: 'Chưa có dữ liệu',
    emptyHint: 'Dữ liệu mới sẽ xuất hiện tại đây.',
    saved: 'Đã lưu thay đổi',
    error: 'Không thể thực hiện. Vui lòng thử lại.',
    forbiddenTitle: '403',
    forbiddenDescription: 'Bạn không có quyền truy cập trang này.',
    notFoundTitle: '404',
    notFoundDescription: 'Không tìm thấy trang yêu cầu.',
    returnWorkspace: 'Quay lại không gian làm việc',

    // Auth & Workspace intro
    workspaceHeading: 'Không gian làm việc của bạn',
    workspaceSub: 'Truy cập tài khoản để quản lý dữ liệu và công việc.',
    totpHint: 'Nếu tài khoản đã bật xác thực hai bước.',
    totpLabel: 'Mã 2FA / Mã khôi phục',
    acceptTermsPrefix: 'Tôi đồng ý với',
    termsOfService: 'điều khoản sử dụng',
    devDraft: 'bản phát triển',
    forgotPassword: 'Quên mật khẩu?',
    moitVerification: 'Thông tin xác nhận Bộ Công Thương',
    legalFooterTerms: 'Điều khoản',
    legalFooterPrivacy: 'Bảo mật',
    legalFooterComplaints: 'Liên hệ & khiếu nại',

    // Confirmation dialogs
    confirmDeleteTitle: 'Xác nhận xóa?',
    confirmPurgeTitle: 'Xóa vĩnh viễn?',
    deleteWarningUndo: 'Hành động này không thể hoàn tác.',
    deleteWarningTrash: 'Bạn có thể khôi phục mục đã xóa từ Thùng rác.',
    revokeSessionTitle: 'Thu hồi phiên đăng nhập?',
    revokeSessionDesc: 'Thiết bị này sẽ cần đăng nhập lại.',
    revokeSessionsPageDesc: 'Thu hồi phiên để ngắt quyền truy cập từ thiết bị đó.',
    deleteFileTitle: 'Xóa tệp?',
    deleteFileDesc: 'Hành động này sẽ xóa vĩnh viễn tệp khỏi hệ thống.',

    // Profile & Security page
    personalProfile: 'Thông tin cá nhân',
    passwordAndSecurity: 'Mật khẩu & bảo mật',
    currentPassword: 'Mật khẩu hiện tại',
    newPasswordLabel: 'Mật khẩu mới (từ 12 ký tự)',
    changePassword: 'Đổi mật khẩu',
    signOutOtherDevices: 'Đăng xuất các thiết bị khác',
    twoFactorAuth: 'Xác thực hai bước (2FA)',
    enabled: 'Đã bật',
    notEnabled: 'Chưa bật',
    disable2FA: 'Tắt 2FA',
    setUpAuthenticator: 'Thiết lập ứng dụng xác thực',
    twoFaSecretHint: 'Thêm mã khóa bí mật này vào ứng dụng xác thực, sau đó nhập mã hiển thị hiện tại.',
    verificationCode: 'Mã xác thực',
    enable2FA: 'Bật 2FA',
    saveRecoveryCodesTitle: 'Lưu mã khôi phục của bạn',
    saveRecoveryCodesDesc: 'Mỗi mã chỉ sử dụng được một lần. Hãy lưu trữ an toàn. Mã này sẽ không hiển thị lại.',
    savedCodesConfirm: 'Tôi đã lưu các mã này an toàn',
    personalDataRequest: 'Yêu cầu dữ liệu cá nhân',
    personalDataRequestHint: 'Yêu cầu sẽ được người quản trị hệ thống xem xét và phản hồi.',
    requestType: 'Loại yêu cầu',
    accessMyData: 'Truy cập dữ liệu của tôi',
    correctMyData: 'Chỉnh sửa dữ liệu của tôi',
    deleteMyData: 'Xóa tài khoản và dữ liệu',
    detailsPrompt: 'Chi tiết yêu cầu',
    submitRequest: 'Gửi yêu cầu',

    // Files page
    filesSpec: 'JPEG, PNG, WebP | tối đa 5 MB | lưu trữ riêng tư',
    fileLabel: 'Tệp',
    sizeLabel: 'Kích thước',
    useAsAvatar: 'Đặt làm ảnh đại diện',

    // Settings page
    applicationSettings: 'Cấu hình ứng dụng',
    ownerInformation: 'Thông tin chủ sở hữu',
    ownerInfoHint: 'Sử dụng thông tin pháp lý đã xác minh cho ứng dụng này.',
    dateFormat: 'Định dạng ngày',
    moitHeading: 'Bộ Công Thương',
    verificationUrl: 'Đường dẫn xác nhận chính thức',

    // Legal Editor
    legalDraftsHint: 'Bản nháp được lưu riêng tư. Hãy hoàn thiện và xem lại kỹ trước khi xuất bản.',
    publishThisVersion: 'Xuất bản phiên bản này',
    savePolicy: 'Lưu chính sách',

    // Password reset & tokens
    resetPassword: 'Đặt lại mật khẩu',
    verifyEmail: 'Xác minh email',
    confirmAction: 'Xác nhận',
    newPassword: 'Mật khẩu mới',
    totpOptional: 'Mã 2FA / Mã khôi phục (nếu đã bật)',
    resetComplete: 'Hoàn tất. Bạn có thể đăng nhập ngay.',
    resetError: 'Không thể hoàn tất. Vui lòng kiểm tra lại liên kết và mã xác thực.',
    forgotSentHint: 'Nếu tài khoản tồn tại, bạn sẽ nhận được email hướng dẫn.',
    forgotError: 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.',
    sendResetLink: 'Gửi liên kết đặt lại',

    // Error codes
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
    TOTP_REQUIRED: 'Nhập mã xác thực hai bước.',
    INVALID_TOTP: 'Mã xác thực không hợp lệ.',
    VALIDATION_ERROR: 'Kiểm tra lại thông tin đã nhập.',
    FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
    ACCOUNT_THROTTLED: 'Có nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.',
    ALREADY_EXISTS: 'Thông tin này đã tồn tại.',
    SESSION_REVOKED: 'Phiên đăng nhập đã hết hiệu lực.',
    NETWORK_ERROR: 'Không thể kết nối đến máy chủ.',
  },
  en: {
    // Navigation / Modules
    workspace: 'WORKSPACE',
    items: 'Sample items',
    files: 'My files',
    notifications: 'Notifications',
    users: 'Users',
    roles: 'Roles & permissions',
    audit: 'Audit log',
    legal: 'Legal content',
    settings: 'Settings',
    system: 'System status',
    'api-docs': 'API documentation',
    jobs: 'Background jobs',
    'privacy-requests': 'Personal data requests',
    profile: 'Profile & security',
    sessions: 'Signed-in devices',
    activity: 'My activity',

    // Core actions
    add: 'Add new',
    save: 'Save changes',
    cancel: 'Cancel',
    search: 'Search',
    logout: 'Sign out',
    login: 'Sign in',
    register: 'Create account',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    close: 'Close',
    back: 'Back',
    restore: 'Restore',
    deletePermanently: 'Delete permanently',
    markRead: 'Mark read',
    details: 'Details',
    revoke: 'Revoke',
    preview: 'Preview',
    retry: 'Retry',
    select: 'Select',

    // Common labels & fields
    email: 'Email',
    password: 'Password',
    name: 'Full name',
    title: 'Title',
    description: 'Description',
    actions: 'Actions',
    status: 'Status',
    created: 'Created',
    createdAt: 'Time',
    updatedAt: 'Updated',
    active: 'Active',
    locked: 'Locked',
    read: 'Read',
    unread: 'Unread',
    trash: 'Trash',
    records: 'records',
    selected: 'selected',
    deleteSelected: 'Delete selected',
    allStatuses: 'All statuses',
    version: 'Version',
    effectiveDate: 'Effective date',
    content: 'Content',
    device: 'Device',
    signedIn: 'Signed in',
    currentDevice: 'Current',

    // States & hints
    empty: 'No records yet',
    emptyHint: 'New records will appear here.',
    saved: 'Changes saved',
    error: 'Unable to complete this action. Please try again.',
    forbiddenTitle: '403',
    forbiddenDescription: 'You do not have permission to view this page.',
    notFoundTitle: '404',
    notFoundDescription: 'Page not found.',
    returnWorkspace: 'Return to workspace',

    // Auth & Workspace intro
    workspaceHeading: 'Your workspace',
    workspaceSub: 'Sign in to manage your data and work.',
    totpHint: 'If enabled for your account.',
    totpLabel: '2FA / Recovery code',
    acceptTermsPrefix: 'I accept the',
    termsOfService: 'terms of service',
    devDraft: 'development draft',
    forgotPassword: 'Forgot password?',
    moitVerification: 'Ministry of Industry and Trade Verification',
    legalFooterTerms: 'Terms',
    legalFooterPrivacy: 'Privacy',
    legalFooterComplaints: 'Contact & complaints',

    // Confirmation dialogs
    confirmDeleteTitle: 'Delete record?',
    confirmPurgeTitle: 'Delete permanently?',
    deleteWarningUndo: 'This action cannot be undone.',
    deleteWarningTrash: 'You can restore deleted items from Trash.',
    revokeSessionTitle: 'Revoke session?',
    revokeSessionDesc: 'This device will need to sign in again.',
    revokeSessionsPageDesc: 'Revoke a session to stop access from that device.',
    deleteFileTitle: 'Delete file?',
    deleteFileDesc: 'This permanently removes the file.',

    // Profile & Security page
    personalProfile: 'Profile',
    passwordAndSecurity: 'Password & security',
    currentPassword: 'Current password',
    newPasswordLabel: 'New password (12+ characters)',
    changePassword: 'Change password',
    signOutOtherDevices: 'Sign out other devices',
    twoFactorAuth: 'Two-factor authentication',
    enabled: 'Enabled',
    notEnabled: 'Not enabled',
    disable2FA: 'Disable 2FA',
    setUpAuthenticator: 'Set up authenticator',
    twoFaSecretHint: 'Add this secret to your authenticator, then enter the current code.',
    verificationCode: 'Verification code',
    enable2FA: 'Enable 2FA',
    saveRecoveryCodesTitle: 'Save your recovery codes',
    saveRecoveryCodesDesc: 'Each code can be used once. Store them somewhere safe. They will not be shown again.',
    savedCodesConfirm: 'I have saved these codes',
    personalDataRequest: 'Personal data request',
    personalDataRequestHint: 'Requests are reviewed by the application owner.',
    requestType: 'Request type',
    accessMyData: 'Access my data',
    correctMyData: 'Correct my data',
    deleteMyData: 'Delete my account and data',
    detailsPrompt: 'Details',
    submitRequest: 'Submit request',

    // Files page
    filesSpec: 'JPEG, PNG, WebP | maximum 5 MB | private storage',
    fileLabel: 'File',
    sizeLabel: 'Size',
    useAsAvatar: 'Use as avatar',

    // Settings page
    applicationSettings: 'Application',
    ownerInformation: 'Owner information',
    ownerInfoHint: 'Use verified information for this application.',
    dateFormat: 'Date format',
    moitHeading: 'Ministry of Industry and Trade',
    verificationUrl: 'Official verification URL',

    // Legal Editor
    legalDraftsHint: 'Drafts stay private. Complete and review each policy before publishing.',
    publishThisVersion: 'Publish this version',
    savePolicy: 'Save policy',

    // Password reset & tokens
    resetPassword: 'Reset password',
    verifyEmail: 'Verify email',
    confirmAction: 'Confirm',
    newPassword: 'New password',
    totpOptional: '2FA / recovery code (if enabled)',
    resetComplete: 'Completed. You can sign in.',
    resetError: 'Unable to complete. Check the link and verification code.',
    forgotSentHint: 'If the account exists, you will receive an email.',
    forgotError: 'Unable to request reset. Try again later.',
    sendResetLink: 'Send reset link',

    // Error codes
    INVALID_CREDENTIALS: 'Email or password is incorrect.',
    TOTP_REQUIRED: 'Enter your two-factor authentication code.',
    INVALID_TOTP: 'Invalid verification code.',
    VALIDATION_ERROR: 'Check the information you entered.',
    FORBIDDEN: 'You do not have permission.',
    ACCOUNT_THROTTLED: 'Too many failed attempts. Please try again later.',
    ALREADY_EXISTS: 'This record already exists.',
    SESSION_REVOKED: 'Your session has been revoked.',
    NETWORK_ERROR: 'Cannot connect to API.',
  },
};

let locale = (localStorage.getItem('base.locale') || 'vi') as 'vi' | 'en';
const listeners = new Set<() => void>();

export function setLocale(value: 'vi' | 'en') {
  locale = value;
  localStorage.setItem('base.locale', value);
  document.documentElement.lang = value;
  listeners.forEach((fn) => fn());
}

export function useI18n() {
  const lang = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => locale,
  );
  const t = useCallback(
    (key: string, fallback?: string) =>
      (dictionary[lang] as Record<string, string>)[key] || fallback || key,
    [lang],
  );
  return { locale: lang, setLocale, t };
}

export const errorMessage = (error: any, t: (key: string) => string) => {
  const code = error?.code || 'error';
  const message = t(code);
  return message === code ? t('error') : message;
};
