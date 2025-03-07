import '@/assets/styles/components/Navbar.css';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { verifyToken, logout} from '@/utils/userInstance';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
            
    const logOut = () => {
        logout();
        navigate("/animals");
      };

    return (
        <div className="flex flex-col min-h-10">
            <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border">
                <div className="container mx-auto h-full">
                    <div className="flex justify-between items-center h-full px-4">
                        <div className="flex items-center gap-4">
                        <Link to="/"><h1 className="text-xl font-bold">ZooExplore</h1></Link>
                        </div>

                        <div className="flex-1 flex items-center space-x-4">
                            <Button variant="ghost" className="ml-10" asChild>
                                <Link to="/">Home</Link>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button  className="flex items-center gap-2">
                                        Animals <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link to="/animals"
                                        className="w-full h-full text-foreground no-underline hover:no-underline">
                                        View All
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/animals/mammal"
                                        className="w-full h-full text-foreground no-underline hover:no-underline">
                                            Mammals
                                        </Link>
                                        </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/animals/bird"
                                        className="w-full h-full text-foreground no-underline hover:no-underline">
                                            Birds
                                        </Link>
                                        </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/animals/reptile"
                                        className="w-full h-full text-foreground no-underline hover:no-underline">
                                            Reptiles
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>

                        <div className="flex items-center">
                          {verifyToken().isValid ?
                                (
                                <div className='flex space-x-3'>
                                  <Button variant="destructive" size="default" onClick={logOut}>
                                      Disconnect
                                  </Button>
                                  <Button variant="outline" size="default" disabled>
                                      Hi {verifyToken().username }
                                  </Button>
                                </div>
                             ):(
                                <Link to="/login">
                                    <Button variant="outline" size="default">
                                        Connect (Admin)
                                    </Button>
                                </Link>
                              )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;