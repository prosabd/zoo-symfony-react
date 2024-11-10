import React from "react";
import axios from "axios";
import "@/assets/styles/Home.css";
import { Sidebar, SidebarContent, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
// import Navbar from '@/components/Navbar';
// import Card from '@/components/Card';
// import Footer from '@/components/Footer';

interface Props {}

interface Animal {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface State {
  animals: Animal[];
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animals: [],
    };
  }

  componentDidMount() {
    console.log("Component did mount");
    axios
      .get("localhost:8000/api/animals")
      .then((res) => {
        this.setState({ animals: res.data });
        console.log("test");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen">
            <Sidebar variant="sidebar" side="left">
              <SidebarContent>
                {/* Sidebar content goes here */}
                <Button variant="default">Click me</Button>
              </SidebarContent>
            </Sidebar>
          </div>
        </SidebarProvider>
        <h1>Home</h1>
        <Button variant="default">Click me</Button>
        {/* <Sidebar variant="sidebar" side="left" /> */}
        {/* <Navbar /> */}
        {/* {this.state.animals.map(animal => (
                    <Card 
                        key={animal.id}  // Assuming `id` is a unique identifier for each animal
                        title={animal.name} 
                        description={animal.description} 
                        imageUrl={animal.imageUrl} 
                    />
                ))}
                <Footer /> */}
      </div>
    );
  }
}

export default Home;
