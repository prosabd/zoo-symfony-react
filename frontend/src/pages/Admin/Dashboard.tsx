import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import instance, { verifyToken } from "@/utils/userInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import User from "@/models/User";
import Animal from "@/models/Animal";
import Family from "@/models/Family";
import Continent from "@/models/Continent";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchData = async () => {
    try {
      const [usersRes, animalsRes, familiesRes, continentsRes] = await Promise.all([
        instance.get('/users'),
        instance.get('/animals'),
        instance.get('/families'),
        instance.get('/continents')
      ]);

      setUsers(usersRes.data['hydra:member']);
      setAnimals(animalsRes.data['hydra:member']);
      setFamilies(familiesRes.data['hydra:member']);
      setContinents(continentsRes.data['hydra:member']);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

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
                  <AvatarImage src="https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/user.jpeg" />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.email}</p>
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
              <Avatar>
                  <AvatarImage src={
                          "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
                          animal.name.replace(" ", "_") +
                          ".jpg"
                            ? "https://github.com/prosabd/zoo-symfony-react/releases/download/0.0.0/" +
                              animal.name.replace(" ", "_") +
                              ".jpg"
                            : "@/public/user_assets/animals_images/" +
                              animal.name.replace(" ", "_") +
                              ".{" +
                              ["jpg", "png", "jpeg"].join("|") +
                              "}"
                        } 
                   />
                  <AvatarFallback>.</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{animal.name}</p>
                <p className="text-sm text-muted-foreground">
                  {animal.family.name} - {animal.continents?.map(c => c.name).join(', ').slice(0, 20)}{(animal.continents?.length ?? 0) > 1 ? '...' : ''}
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
              <Avatar>
                  <AvatarImage src={`@/assets/images/families/${family.name.toLowerCase().replace(" ", "_")}.svg`}
                  />
                  <AvatarFallback>.</AvatarFallback>
              </Avatar>
              <img src={`../../assets/images/families/insect.svg`} alt={`@/assets/images/families/${family.name.toLowerCase().replace(" ", "_")}.svg`} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-sm font-medium leading-none">{family.name}</p>
                <p className="text-sm text-muted-foreground">
                  {family.description?.slice(0, 20)}{family.description && family.description.length > 20 ? '...' : ''}
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
              <div className="flex-1 min-w-0">
              <p className="text-sm font-small leading-none break-words hyphens-auto">{continent.name}</p>
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