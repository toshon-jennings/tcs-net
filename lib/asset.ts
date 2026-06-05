// Prefix a public asset path with the deploy basePath (e.g. "/tcs-net").
// Needed because next/image with `unoptimized: true` does not add basePath to src.
export const asset = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
