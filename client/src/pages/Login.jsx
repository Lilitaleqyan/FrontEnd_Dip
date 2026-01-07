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
import RegisterForm from "./User"; 
export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
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
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Մուտք / Գրանցում</h1>
          <p className="text-muted-foreground">
            Մուտք գործեք գրադարան
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">
              {isRegister ? "Գրանցում" : "Մուտք"}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isRegister ? (
              <>
                <RegisterForm />

                <Button
                  variant="link"
                  className="w-full mt-4"
                  onClick={() => setIsRegister(false)}
                >
                  Արդեն ունե՞ք հաշիվ — Մուտք
                </Button>
              </>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
               <input
                  type="text"
                  name="fake-username"
                  autoComplete="username"
                  style={{ display: "none" }}
                />
                <input
                  type="password"
                  name="fake-password"
                  autoComplete="current-password"
                  style={{ display: "none" }}
                   />
                  <div>
                    <Label htmlFor="username" className="mb-2 block">
                      Օգտանուն
                    </Label>
                    <Input
                      id="username"
                       name="username"
                       autoComplete="off"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="  "
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="mb-2 block">
                      Գաղտնաբառ
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                         autoComplete="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            rememberMe: !!checked,
                          })
                        }
                      />
                      <Label htmlFor="remember">Հիշել ինձ</Label>
                    </div>

                    <Button variant="link" size="sm">
                      Մոռացել եք գաղտնաբառը?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Մուտք..." : "Մուտք"}
                  </Button>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => setIsRegister(true)}
                  >
                    Գրանցվել
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
