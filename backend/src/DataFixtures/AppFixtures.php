<?php

namespace App\DataFixtures;

use App\Entity\Animal;
use App\Entity\Continent;
use App\Entity\Family;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Create Families
        $families = [
            'mammal' => 'Vertebrate animals that nurse their young with milk',
            'reptile' => 'Vertebrate animals that crawl',
            'fish' => 'Vertebrate animals of the aquatic world',
            'bird' => 'Vertebrate animals with feathers capable of flying',
            'amphibian' => 'Vertebrate animals that live on land and in water',
            'insect' => 'Six-legged invertebrate animals',
            'arachnid' => 'Eight-legged invertebrate animals',
            'cephalopod' => 'Marine animals with tentacles',
            'crustacean' => 'Aquatic animals with a shell'
        ];

        $familyEntities = [];
        foreach ($families as $name => $description) {
            $family = new Family();
            $family->setName($name);
            $family->setDescription($description);
            $manager->persist($family);
            $familyEntities[$name] = $family;
        }

        // Create Continents
        $continents = ['Europe', 'Asia', 'Africa', 'Oceania', 'North America', 'South America', 'Antarctica'];

        $continentEntities = [];
        foreach ($continents as $name) {
            $continent = new Continent();
            $continent->setName($name);
            $manager->persist($continent);
            $continentEntities[$name] = $continent;
        }

        // Create Animals
        $animals = [
            ['Dog', 'mammal', 'A domestic animal', ['Europe', 'Asia', 'Africa', 'Oceania', 'North America', 'South America']],
            ['Pig', 'mammal', 'A farm animal', ['Europe', 'Africa']],
            ['Snake', 'reptile', 'A dangerous animal', ['Europe', 'Africa', 'Oceania']],
            ['Crocodile', 'reptile', 'A very dangerous animal', ['Europe', 'Oceania']],
            ['Shark', 'fish', 'A highly dangerous marine animal', ['Asia']],
            ['Eagle', 'bird', 'A majestic bird of prey', ['Europe', 'North America']],
            ['Frog', 'amphibian', 'A jumping amphibian', ['South America']],
            ['Butterfly', 'insect', 'A colorful insect', ['Asia']],
            ['Spider', 'arachnid', 'An eight-legged arachnid', ['Africa']],
            ['Octopus', 'cephalopod', 'An intelligent cephalopod', ['Oceania']],
            ['Lobster', 'crustacean', 'A delicious crustacean', ['North America']],
            ['Lion', 'mammal', 'The king of the savannah', ['Africa']],
            ['Penguin', 'bird', 'A swimming bird', ['Antarctica']],
            ['Turtle', 'reptile', 'A reptile with a shell', ['South America']],
            ['Dolphin', 'mammal', 'An intelligent marine mammal', ['Oceania']],
            ['Koala', 'mammal', 'An arboreal marsupial', ['Oceania']],
            ['Panda', 'mammal', 'A herbivorous bear', ['Asia']],
            ['Gorilla', 'mammal', 'A large ape', ['Africa']],
            ['Kangaroo', 'mammal', 'A jumping marsupial', ['Oceania']],
            ['Toucan', 'bird', 'A bird with a colorful beak', ['South America']],
            ['Flamingo', 'bird', 'A pink wading bird', ['Africa']],
            ['Chameleon', 'reptile', 'A color-changing reptile', ['Africa']],
            ['Seahorse', 'fish', 'A uniquely shaped fish', ['Oceania']],
            ['Orca', 'mammal', 'A predatory cetacean', ['Antarctica']],
            ['Polar Bear', 'mammal', 'An Arctic mammal', ['North America']],
            ['Emperor Penguin', 'bird', 'An Antarctic bird', ['Antarctica']],
            ['Hummingbird', 'bird', 'The smallest bird', ['South America']],
            ['Axolotl', 'amphibian', 'A regenerating amphibian', ['North America']],
            ['Scorpion', 'arachnid', 'A venomous arachnid', ['Africa']],
            ['Jellyfish', 'fish', 'A translucent marine animal', ['Asia']],
            ['Pangolin', 'mammal', 'A scaly mammal', ['Asia']],
            ['Okapi', 'mammal', 'A relative of the giraffe', ['Africa']],
            ['Nautilus', 'cephalopod', 'A shelled cephalopod', ['Oceania']],
            ['Tapir', 'mammal', 'A mammal with a trunk', ['South America']],
            ['Komodo Dragon', 'reptile', 'The largest lizard', ['Asia']]
        ];

        foreach ($animals as [$name, $familyName, $description, $animalContinents]) {
            $animal = new Animal();
            $animal->setName($name);
            $animal->setDescription($description);
            $animal->setFamily($familyEntities[$familyName]);
            foreach ($animalContinents as $continentName) {
                $animal->addContinent($continentEntities[$continentName]);
            }
            $manager->persist($animal);
        }

        // Create Users
        $users = [
            ['user', 'user@test.com', false],
            ['user-test', 'user-test@test.com', false],
            ['admin', 'admin@test.com', true],
            ['admin-test', 'admin-test@test.com', true],
        ];

        foreach ($users as [$username, $email, $isAdmin]) {
            $user = new User();
            $user->setCustomUsername($username);
            $user->setEmail($email);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password'));
            $user->setAdmin($isAdmin);
            $user->setRoles($isAdmin ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER']);
            $manager->persist($user);
        }

        $manager->flush();
    }
}

