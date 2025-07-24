import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto p-8 text-center">
        <Construction className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-6">{description}</p>
        <p className="text-sm text-muted-foreground">
          This page is coming soon! Continue prompting to have us build out this section.
        </p>
      </Card>
    </div>
  );
}
