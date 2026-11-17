// קופסה אדומה לשגיאה כללית של טופס / פעולה (למשל: "כתובת המייל כבר רשומה במערכת").
// whiteSpace: 'pre-line' כדי שכמה הודעות מהשרת יופיעו כל אחת בשורה משלה
interface ErrorBoxProps {
  message: string | null;
}

function ErrorBox({ message }: ErrorBoxProps) {
  if (message === null) return null;

  return (
    <div
      role="alert"
      style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#dc2626',
        padding: '10px 12px',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: 700,
        whiteSpace: 'pre-line',
      }}
    >
      ❌ {message}
    </div>
  );
}

export default ErrorBox;
