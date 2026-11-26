import { useId, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, UserRound, KeyRound } from 'lucide-react';

export function AuthField({
  name,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  minLength,
  maxLength,
  required = true,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const Icon =
    name === 'email'
      ? Mail
      : name === 'password'
        ? LockKeyhole
        : name === 'totp'
          ? KeyRound
          : UserRound;
  return (
    <div className="sgx-auth-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className={`sgx-auth-input ${error ? 'has-error' : ''}`}>
        <Icon size={19} className="sgx-auth-input-icon" aria-hidden="true" />
        <input
          id={id}
          name={name}
          type={type === 'password' && visible ? 'text' : type}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => {
            setError('');
            onChange(event.target.value);
          }}
          onInvalid={(event) => {
            const input = event.currentTarget;
            setError(
              input.validity.valueMissing
                ? `Vui lòng nhập ${label.toLowerCase()}.`
                : input.validity.typeMismatch
                  ? 'Email chưa đúng định dạng.'
                  : input.validity.tooShort
                    ? `Vui lòng nhập ít nhất ${minLength} ký tự.`
                    : 'Vui lòng kiểm tra lại thông tin.',
            );
          }}
        />
        {type === 'password' && (
          <button
            type="button"
            className="sgx-auth-password-toggle"
            aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="sgx-auth-field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
