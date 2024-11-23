<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiFilter;
use App\Repository\AnimalRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AnimalRepository::class)]
#[ApiFilter(SearchFilter::class, properties: ['family' => 'exact'])]
#[ApiResource]
class Animal
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read'])]  // Only readable, not writable
    private ?int $id = null;
    
    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['read', 'write'])]
    private ?string $name = null;
    
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['read', 'write'])]
    private ?string $description = null;
    
    #[ORM\ManyToOne(inversedBy: 'animal')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['read', 'write'])]
    private ?Family $family = null;
    
    /**
     * @var Collection<int, Continent>
     */
    #[ORM\ManyToMany(targetEntity: Continent::class, inversedBy: 'animals')]
    #[Groups(['read', 'write'])]
    private Collection $continents;

    public function __construct()
    {
        $this->continents = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getFamily(): ?Family
    {
        return $this->family;
    }

    public function setFamily(?Family $family): static
    {
        $this->family = $family;

        return $this;
    }

    /**
     * @return Collection<int, Continent>
     */
    public function getContinents(): Collection
    {
        return $this->continents;
    }

    public function addContinent(Continent $continent): static
    {
        if (!$this->continents->contains($continent)) {
            $this->continents->add($continent);
        }

        return $this;
    }

    public function removeContinent(Continent $continent): static
    {
        $this->continents->removeElement($continent);

        return $this;
    }
}
