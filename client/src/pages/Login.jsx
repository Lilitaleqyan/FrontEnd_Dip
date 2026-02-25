import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { login as loginUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import {forgotPassword, resetPassword} from "@/lib/storage"
import RegisterForm from "./User";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [resetEmail, setResetEmail] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
  const handleNewPasswordSubmit = async () => {
  if (newPassword !== confirmPassword) {
    toast({ title: "Սխալ", description: "Գաղտնաբառերը չեն համընկնում", variant: "destructive" });
    return;
  }

  try {
    await resetPassword(token, newPassword);
    toast({ title: "Գաղտնաբառը թարմացվեց", description: "Կարող եք մուտք գործել նոր գաղտնաբառով" });
    setNewPassword("");
    setConfirmPassword("");
    setLocation("/login");
  } catch (error) {
    toast({ title: "Սխալ", description: "Չհաջողվեց թարմացնել գաղտնաբառը", variant: "destructive" });
  }
};

  const handleForgotPassword = async () => {
  if (!resetEmail) {
    toast({
      title: "Սխալ",
      description: "Մուտքագրեք էլ․ հասցեն",
      variant: "destructive",
    });
    return;
  }

  try {
    await forgotPassword(resetEmail)

    toast({
      title: "Ստուգեք email-ը",
      description: "Մենք ուղարկել ենք գաղտնաբառի վերականգնման հղում",
    });

    setShowForgotPassword(false);
    setResetEmail("");
  } catch (error) {
    toast({
      title: "Սխալ",
      description: "Չհաջողվեց ուղարկել email",
      variant: "destructive",
    });
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Մուտք / Գրանցում</h1>
          <p className="text-muted-foreground">Մուտք գործեք գրադարան</p>
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
                  <input type="text" name="fake-username" autoComplete="username" style={{ display: "none" }} />
                  <input type="password" name="fake-password" autoComplete="current-password" style={{ display: "none" }} />

                  <div>
                    <Label htmlFor="username" className="mb-2 block">Օգտանուն</Label>
                    <Input
                      id="username"
                      autoComplete="off"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="mb-2 block">Գաղտնաբառ</Label>
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
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, rememberMe: !!checked })
                        }
                      />
                      <Label htmlFor="remember">Հիշել ինձ</Label>
                    </div>

                    <Button variant="link" size="sm" onClick={() => setShowForgotPassword(true)}>
                      Մոռացել եք գաղտնաբառը?
                    </Button>
                  </div>

                  <Button type="submit" className="w-full">
                    {isLoading ? "Մուտք..." : "Մուտք"}
                  </Button>

                  <Button type="button" className="w-full" onClick={() => setIsRegister(true)}>
                    Գրանցվել
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>

 <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Գաղտնաբառի վերականգնում</DialogTitle>
    </DialogHeader>

    <div className="space-y-4">
      <div>
        <Label htmlFor="resetEmail">Էլ․ հասցե</Label>
        <Input
          id="resetEmail"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="example@mail.com"
          required
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setShowForgotPassword(false)}>
        Չեղարկել
      </Button>
      <Button onClick={handleForgotPassword}>
        Ուղարկել հղում
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}
