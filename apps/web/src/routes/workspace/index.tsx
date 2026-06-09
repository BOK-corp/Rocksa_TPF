import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody } from "@rocksa/ui";

export const Route = createFileRoute("/workspace/")({ component: WorkspaceWelcome });

function WorkspaceWelcome() {
  return (
    <main className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block bg-gradient-to-br from-brand-200 to-brand-100" />
      <div className="flex flex-col justify-center p-10 max-w-xl">
        <p className="font-display text-brand-600 text-xl">Rocksa</p>
        <h1 className="font-display text-4xl mt-6">Welcome to your Workspace</h1>
        <p className="text-ink-500 mt-3">
          Step into a luminous environment engineered for precision. Manage your rare gemstone
          acquisitions, track provenance, and orchestrate your collection with absolute clarity.
        </p>
        <div className="mt-8 space-y-3">
          {[
            ["Curated Inventory", "Catalog loose gems and bespoke pieces."],
            ["Market Analytics", "Monitor valuation trends and rarity metrics."],
            ["Certification Reports", "Editorial-quality provenance reports."],
          ].map(([t, d]) => (
            <Card key={t} className="bg-brand-50/60">
              <CardBody>
                <h3 className="font-display text-lg">{t}</h3>
                <p className="text-ink-500 text-sm">{d}</p>
              </CardBody>
            </Card>
          ))}
        </div>
        <Button asChild className="mt-8 w-full" size="lg">
          <Link to="/workspace/overview">Enter Dashboard →</Link>
        </Button>
      </div>
    </main>
  );
}
