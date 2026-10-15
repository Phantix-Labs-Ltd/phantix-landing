// Build-time render of /securegraph/docs, loaded by scripts/prerender-docs.ts.
// Never imported by the browser bundle.
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import SecureGraphDocs from "@/pages/SecureGraphDocs";
import { DOCS_PATH } from "@/lib/docsSeo";

export { DOCS_DESCRIPTION, DOCS_PATH, DOCS_TITLE, DOCS_URL, docsJsonLd } from "@/lib/docsSeo";

export function render(): string {
  return renderToString(
    <MemoryRouter initialEntries={[DOCS_PATH]}>
      <SecureGraphDocs />
    </MemoryRouter>,
  );
}
