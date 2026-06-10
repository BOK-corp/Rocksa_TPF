import { createFileRoute, Link } from "@tanstack/react-router";
import { Button, Card, CardBody } from "@rocksa/ui";
import { DiamondIcon } from "../../components/Icons.tsx";

export const Route = createFileRoute("/workspace/")({ component: WorkspaceWelcome });

function WorkspaceWelcome() {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-400" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 0%, transparent 45%), radial-gradient(circle at 75% 65%, white 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <DiamondIcon className="mb-6 h-12 w-12 text-brand-100" />
          <p className="font-display text-5xl leading-tight">Curator&apos;s Atelier</p>
          <p className="mt-3 max-w-md text-sm text-brand-100/90">
            A luminous command center for provenance, valuation, and the quiet
            orchestration of rare earth treasures.
          </p>
        </div>
      </div>

      <div className="flex max-w-xl flex-col justify-center p-10">
        <p className="font-display text-xl text-brand-600">Rocksa</p>
        <h1 className="mt-6 font-display text-4xl">Welcome to your Workspace</h1>
        <p className="mt-3 text-ink-500">
          Step into a luminous environment engineered for precision. Manage your
          rare gemstone acquisitions, track provenance, and orchestrate your
          collection with absolute clarity.
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
                <p className="text-sm text-ink-500">{d}</p>
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
