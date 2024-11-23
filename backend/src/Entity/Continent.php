<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\ContinentRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;

#[ORM\Entity(repositoryClass: ContinentRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read'], 'enable_max_depth' => true],
    denormalizationContext: ['groups' => ['write'], 'enable_max_depth' => true]
)]
class Continent
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read'])]  // Only readable, not writable

    private ?int $id = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['read', 'write'])]
    private ?string $name = null;

    /**
     * @var Collection<int, Animal>
     */
    #[ORM\ManyToMany(targetEntity: Animal::class, mappedBy: 'continents')]
    #[Groups(['read', 'write'])]
    #[MaxDepth(1)]
    private Collection $animals;

    public function __construct()
    {
        $this->animal = new ArrayCollection();
        $this->animals = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Animal>
     */
    public function getAnimals(): Collection
    {
        return $this->animals;
    }

    public function addAnimal(Animal $animal): static
    {
        if (!$this->animals->contains($animal)) {
            $this->animals->add($animal);
            $animal->addContinent($this);
        }

        return $this;
    }

    public function removeAnimal(Animal $animal): static
    {
        if ($this->animals->removeElement($animal)) {
            $animal->removeContinent($this);
        }

        return $this;
    }
}
