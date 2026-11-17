// הודעה קטנה מתחת לשדה בטופס:
// error = מה לא תקין (באדום). מוצג רק אם show=true, כדי לא "לצעוק" על המשתמש לפני שהתחיל להקליד
// hint  = עזרה / מה נשאר (באפור), למשל "נשארו עוד 3 ספרות"
interface FieldMessageProps {
  error: string | null;
  show: boolean;
  hint?: string;
}

function FieldMessage({ error, show, hint }: FieldMessageProps) {
  if (show && error !== null) {
    return (
      <span style={{ display: 'block', fontSize: '12px', color: '#dc2626', fontWeight: 700, marginTop: '4px' }}>
        ⚠️ {error}
      </span>
    );
  }

  if (hint !== undefined && hint !== '') {
    return (
      <span style={{ display: 'block', fontSize: '11px', color: '#5a6b82', marginTop: '4px' }}>
        {hint}
      </span>
    );
  }

  return null;
}

export default FieldMessage;
