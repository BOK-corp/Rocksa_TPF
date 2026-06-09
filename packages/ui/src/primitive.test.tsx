import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge, Button, Card, CardBody, CardHeader, Input } from "./index.ts";

describe("UI primitives", () => {
  it("renders button variants", () => {
    const html = renderToStaticMarkup(
      <>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </>,
    );

    expect(html).toContain("bg-brand-600 text-white hover:bg-brand-700");
    expect(html).toContain("border border-ink-700/10 bg-white text-ink-900 hover:bg-surface-muted");
    expect(html).toContain("text-ink-700 hover:bg-surface-muted");
    expect(html).toContain("text-brand-600 hover:underline");
  });

  it("renders input variants", () => {
    const html = renderToStaticMarkup(
      <>
        <Input variant="boxed" defaultValue="boxed" />
        <Input variant="underline" defaultValue="underlined" />
      </>,
    );

    expect(html).toContain(
      "h-11 rounded-md border border-ink-700/10 bg-white px-3 focus-visible:border-brand-500",
    );
    expect(html).toContain("h-10 border-b border-ink-700/15 focus-visible:border-brand-600");
    expect(html).toContain('value="boxed"');
  });

  it("renders badge tones and card layout", () => {
    const html = renderToStaticMarkup(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">In Stock</Badge>
        </CardBody>
      </Card>,
    );

    expect(html).toContain("bg-brand-100 text-brand-700");
    expect(html).toContain("bg-emerald-100 text-emerald-700");
    expect(html).toContain("rounded-lg bg-white shadow-card border border-ink-700/5");
  });
});
