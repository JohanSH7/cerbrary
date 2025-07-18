import { Card, CardContent } from "@/components/ui/card";
import { AuthTabs } from "@/components/molecules/authTabs";

export const AuthPanel = () => (
  <Card className="w-full shadow-md">
    <CardContent>
      <AuthTabs />
    </CardContent>
  </Card>
);