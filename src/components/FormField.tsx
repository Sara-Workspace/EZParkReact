

interface FormFieldProps {
  label: string;
  value: string;
}

function FormField({ label, value }: FormFieldProps) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 700,
          color: '#2a3b52',
          marginBottom: '4px',
        }}
      >
        {label}
      </label>
      <div
        style={{
          background: 'white',
          border: '1px solid #cfdbea',
          borderRadius: '12px',
          padding: '8px 14px',
          fontSize: '12px',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default FormField;