import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


function LoginForm({ className, ...props }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state

  function handleLogin(e) {
    e.preventDefault();
    // Code to handle login goes here
    setIsLoading(true); // Set isLoading to true to indicate loading
    props.toggle();
  }

  function handleCancel() {
    props.toggle();
  }

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold">Login</CardTitle>
        <CardDescription className="flex justify-center">New? Sign up here</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="font-bold">Username</Label>
              <Input id="name" placeholder="Username" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework" className="font-bold">Password</Label>
              <Input id="name" placeholder="Password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button>Login</Button>
      </CardFooter>
    </Card>
  )
}

export default LoginForm;
