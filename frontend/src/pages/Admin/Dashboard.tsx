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

type EntityType = 'users' | 'animals' | 'families' | 'continents';

interface PaginationState {
  [key: string]: {
    page: number;
    hasMore: boolean;
  };
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [continents, setContinents] = useState<Continent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<'users' | 'animals' | 'families' | 'continents'>('users');
  const [formId, setFormId] = useState<number | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginationState>({
    users: { page: 1, hasMore: false },
    animals: { page: 1, hasMore: false },
    families: { page: 1, hasMore: false },
    continents: { page: 1, hasMore: false }
  });

  const fetchData = async (type?: EntityType, pageNum: number = 1, isLoadingMore: boolean = false
    ) => {
    setLoading(true);
    if (!type) {
      Object.entries(pagination).forEach(([entityType]) => {
        fetchData(entityType as EntityType);
      });
      return;
    }
    try {
      const response = await instance.get(`/${type}?page=${pageNum}`);
      const setterClass = {
        users: setUsers,
        animals: setAnimals,
        families: setFamilies,
        continents: setContinents
      };
  
      if (isLoadingMore) {
        setterClass[type](prev => [...prev, ...response.data['hydra:member']]);
      } else {
        setterClass[type](response.data['hydra:member']);
      }
      
      const view = response.data['hydra:view'] || {};
      setPagination(prev => ({
        ...prev,
        [type]: {
          page: pageNum,
          hasMore: view['@id'] !== view['hydra:last']
        }
      }));
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = (type: EntityType) => {
    const nextPage = pagination[type].page + 1;
    fetchData(type, nextPage, true);
  };

  // Reusable LoadMoreButton component
  const LoadMoreButton = ({ type, loading }: { type: EntityType; loading: boolean }) => (
    pagination[type].hasMore && (
      <Button 
        onClick={() => handleLoadMore(type)}
        disabled={loading}
        size="lg"
        className="mt-4 flex justify-center items-center w-full"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Load More"}
      </Button>
    )
  );

  const handleAdd = (type: EntityType) => {
    setFormType(type);
    setFormId(undefined);
    setOpenForm(true);
  };

  const handleEdit = (type: EntityType, id: number) => {
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
    fetchData(formType);
  };

  const handleFormSubmit = () => {
    setOpenForm(false);
    fetchData(formType);
  };

  useEffect(() => {
    fetchData();
  }, []);
  
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
        <LoadMoreButton type="users" loading={loading} />
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
          <LoadMoreButton type="animals" loading={loading} />
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
          <LoadMoreButton type="families" loading={loading} />
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
          <LoadMoreButton type="continents" loading={loading} />
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default AdminDashboard;