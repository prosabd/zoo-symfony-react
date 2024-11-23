import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };

    const fetchAnimals = async () => {
      const response = await fetch("/api/animals");
      const data = await response.json();
      setAnimals(data);
    };

    const fetchFamilies = async () => {
      const response = await fetch("/api/families");
      const data = await response.json();
      setFamilies(data);
    };

    const fetchContinents = async () => {
      const response = await fetch("/api/continents");
      const data = await response.json();
      setContinents(data);
    };

    fetchUsers();
    fetchAnimals();
    fetchFamilies();
    fetchContinents();
  }, []);

  return (
    <div className="p-4 space-y-4 flex flex-row gap-4 justify-between">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-96">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/nutlope.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Animals</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-96">
          {animals.map((animal) => (
            <div key={animal.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium leading-none">{animal.name}</p>
                <p className="text-sm text-muted-foreground">
                  {animal.family} - {animal.continent}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Families</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-96">
          {families.map((family) => (
            <div key={family.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium leading-none">{family.name}</p>
                <p className="text-sm text-muted-foreground">
                  {family.continent}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Continents</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-96">
          {continents.map((continent) => (
            <div key={continent.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium leading-none">{continent.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;