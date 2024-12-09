import React, { useState, useEffect } from "react";
import instance from "@/utils/userInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import User from "@/models/User";
import Animal from "@/models/Animal";
import Family from "@/models/Family";
import Continent from "@/models/Continent";
import DashboardForm from "@/components/DashboardForm";

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<'users' | 'animals' | 'families' | 'continents'>('users');
  const [formId, setFormId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState<number>(1);

  const fetchData = async (pageNum: number = 1, isLoadingMore: boolean = false) => {
    try {
    const [usersRes, animalsRes, familiesRes, continentsRes] = await Promise.all([
      instance.get(`/users?page=${pageNum}`),
      instance.get(`/animals?page=${pageNum}`),
      instance.get(`/families?page=${pageNum}`),
      instance.get(`/continents?page=${pageNum}`)
    ]);

    if (isLoadingMore) {
      // Add new items to existing lists
      setUsers(prev => [...prev, ...usersRes.data['hydra:member']]);
      setAnimals(prev => [...prev, ...animalsRes.data['hydra:member']]);
      setFamilies(prev => [...prev, ...familiesRes.data['hydra:member']]);
      setContinents(prev => [...prev, ...continentsRes.data['hydra:member']]);
    } else {
      // Reset lists
      setUsers(usersRes.data['hydra:member']);
      setAnimals(animalsRes.data['hydra:member']);
      setFamilies(familiesRes.data['hydra:member']);
      setContinents(continentsRes.data['hydra:member']);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchData(page + 1, true);
  };

  const handleAdd = (type: 'users' | 'animals' | 'families' | 'continents') => {
    setFormType(type);
    setFormId(undefined);
    setOpenForm(true);
  };

  const handleEdit = (type: 'users' | 'animals' | 'families' | 'continents', id: number) => {
    setFormType(type);
    setFormId(id);
    setOpenForm(true);
  };

  const handleDelete = async (uri: string) => {
    try {
      await instance.delete(uri);
      fetchData();
    } catch (error) {
      // error 
    }
  };

  const handleFormClose = () => {
    setOpenForm(false);
    fetchData();
  };

  const handleFormSubmit = () => {
    setOpenForm(false);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return ( 
        <Button className="flex justify-center items-center" disabled>
            <Loader2 className="animate-spin" />
            Please wait
        </Button>
    )
  }

  return (
    <>
    {openForm && (
      <DashboardForm
        type={formType}
        id={formId}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    )}
    <div className="p-4 flex flex-row gap-4 max-h-[85vh] min-h-[30vh] justify-between">
      <Card className="pb-20">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto min-h-[30vh] max-h-full">
          <Button variant="outline" size="sm" onClick={() => handleAdd('users')}className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
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
              <div className="flex items-center space-x-2 m-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit('users', user.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm"  onClick={() => handleDelete(user["@id"].replace("/api", ""))}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="pb-20">
        <CardHeader>
          <CardTitle>Animals</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto min-h-[30vh] max-h-full">
          <Button variant="outline" size="sm" onClick={() => handleAdd('animals')}className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
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
              <div className="flex items-center space-x-2 m-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit('animals', animal.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm"  onClick={() => handleDelete(animal["@id"].replace("/api", ""))}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="pb-20">
        <CardHeader>
          <CardTitle>Families</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto min-h-[30vh] max-h-full">
          <Button variant="outline" size="sm" onClick={() => handleAdd('families')}className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
          {families.map((family) => (
            <div key={family.id} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium leading-none">{family.name}</p>
                <p className="text-sm text-muted-foreground">
                  {family.description?.slice(0, 20)}{family.description && family.description.length > 20 ? '...' : ''}
                </p>
              </div>
              <div className="flex items-center space-x-2 m-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit('families', family.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm"  onClick={() => handleDelete(family["@id"].replace("/api", ""))}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="pb-20">
        <CardHeader>
          <CardTitle>Continents</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto min-h-[30vh] max-h-full">
          <Button variant="outline" size="sm" onClick={() => handleAdd('continents')}className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add
          </Button>
          {continents.map((continent) => (
            <div key={continent.id} className="flex items-center justify-between py-2">
              <div className="flex-1 min-w-0">
              <p className="text-sm font-small leading-none break-words hyphens-auto">{continent.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleEdit('continents', continent.id)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(continent["@id"].replace("/api", ""))}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
    <Button 
            onClick={handleLoadMore}
            disabled={loading}
            size="lg"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : "Load More Data"}
          </Button>
    </>
  );
};

export default AdminDashboard;