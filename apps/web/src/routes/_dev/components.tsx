import { createFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@rocksa/ui";

export const Route = createFileRoute("/_dev/components")({
  component: PrimitiveGallery,
});

function PrimitiveGallery() {
  return (
    <main className="min-h-screen bg-surface-muted p-8 text-ink-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-700">Design system</p>
          <h1 className="font-display text-4xl">Primitive gallery</h1>
          <p className="max-w-2xl text-ink-500">
            Manual review page for the shared UI primitives used across the storefront and
            workspace.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inputs & labels</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="boxed-input">Boxed field</Label>
                <Input id="boxed-input" variant="boxed" placeholder="Search specimens" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="underline-input">Underline field</Label>
                <Input id="underline-input" variant="underline" placeholder="Client name" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badges & avatar</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge tone="brand">New acquisition</Badge>
                <Badge tone="success">In stock</Badge>
                <Badge tone="warning">Low stock</Badge>
                <Badge tone="danger">Hold</Badge>
              </div>
              <div className="flex items-center gap-3">
                <Avatar fallback="RS" />
                <div>
                  <p className="text-sm font-medium text-ink-900">Rocksa curator</p>
                  <p className="text-xs text-ink-500">Workspace account</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabs & checkbox</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Tabs defaultValue="catalog">
                <TabsList>
                  <TabsTrigger value="catalog">Catalog</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                </TabsList>
                <TabsContent value="catalog" className="pt-4 text-sm text-ink-500">
                  Curated specimen notes and pricing snapshots.
                </TabsContent>
                <TabsContent value="inventory" className="pt-4 text-sm text-ink-500">
                  Availability, storage, and provenance data.
                </TabsContent>
              </Tabs>
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <Checkbox defaultChecked />
                Confirm this specimen is ready for listing.
              </label>
            </CardBody>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Layout helpers</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Separator />
            <p className="text-sm text-ink-500">
              This page is intentionally lightweight so the primitives can be reviewed without the
              full storefront.
            </p>
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
