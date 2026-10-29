
export default function ErrorMessage({ message }) {
  if (!message) return null;

  const readableMessage =
    typeof message === "string"
      ? message
      : Array.isArray(message)
        ? message
            .map((item) =>
              typeof item === "string"
                ? item
                : item?.msg || JSON.stringify(item)
            )
            .join(", ")
        : message?.message || JSON.stringify(message);

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      {readableMessage}
    </div>
  );
}
