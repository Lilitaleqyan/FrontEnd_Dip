import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { login as loginUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await loginUser(formData.username, formData.password);
      if (user) {
        toast({
          title: "Մուտքը հաջողվեց",
          description: `Բարի գալուստ, ${user.username}!`,
        });
        const isAdmin = user.role?.toLowerCase() === "admin";
        setIsAdminUser(isAdmin);
  
         setLocation("/");
        window.location.reload();
      } else {
        toast({
          title: "Մուտքի սխալ",
          description: "Սխալ օգտանուն կամ գաղտնաբառ",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Սխալ",
        description: "Մուտքի ժամանակ տեղի ունեցավ սխալ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Մուտք/Գրանցում</h1>
          <p className="text-muted-foreground text-lg">
            Մուտք գործեք գրադարան
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Մուտք գործել</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium mb-2">
                  Օգտանուն
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="admin"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium mb-2">
                  Գաղտնաբառ
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: !!checked })
                    }
                  />
                  <Label htmlFor="remember-me" className="text-sm">
                    Հիշել ինձ
                  </Label>
                </div>
                <Button variant="link" className="text-sm">
                  Մոռացել եք գաղտնաբառը?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Մուտք..." : "Մուտք"}
              </Button>
            </form>

            {/* <div className="mt-6 text-center text-sm text-muted-foreground">
              Թեստային տվյալներ՝ admin / admin123
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
