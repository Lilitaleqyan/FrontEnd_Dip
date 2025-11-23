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
import {getCurrentUser} from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
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
          title: "Успешный вход",
          description: `Добро пожаловать, ${user.username}!`,
        });
        setLocation("/");
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный логин или пароль",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при входе в систему",
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Вход в систему</h1>
          <p className="text-muted-foreground text-lg">
            Войдите для доступа к библиотеке
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Авторизация</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium mb-2">
                  Логин
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="admin"
                  required
                  data-testid="input-username"
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium mb-2">
                  Пароль
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="toggle-password"
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
                    id="remember-me"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, rememberMe: !!checked })
                    }
                    data-testid="checkbox-remember"
                  />
                  <Label htmlFor="remember-me" className="text-sm">
                    Запомнить меня
                  </Label>
                </div>
                <Button variant="link" className="text-sm" data-testid="forgot-password">
                  Забыли пароль?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Тестовые данные: admin / admin123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
