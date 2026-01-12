<?php

namespace App\Entity;

use Symfony\Component\Serializer\Attribute\Groups;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\OdsRepository;

#[ORM\Entity(repositoryClass: OdsRepository::class)]
#[ORM\Table(name: 'ODS')]
class Ods
{
    #[ORM\Id]
    #[ORM\Column(name: 'id_ods', type: 'smallint')]
    #[Groups(['ods:read', 'actividad:read'])]
    private ?int $idOds = null;

    #[ORM\Column(name: 'descripcion', type: 'string', length: 255)]
    #[Groups(['ods:read', 'ods:update', 'actividad:read'])]
    private string $descripcion;

    #[ORM\Column(name: 'imagen_url', type: 'string', length: 255, nullable: true)]
    #[Groups(['ods:read', 'ods:update', 'actividad:read'])]
    private ?string $imagenUrl = null;

    public function setIdOds(int $idOds): self
    {
        $this->idOds = $idOds;
        return $this;
    }

    public function getIdOds(): ?int
    {
        return $this->idOds;
    }

    public function getDescripcion(): string
    {
        return $this->descripcion;
    }

    public function setDescripcion(string $descripcion): self
    {
        $this->descripcion = $descripcion;
        return $this;
    }

    public function getImagenUrl(): string
    {
        return $this->imagenUrl;
    }

    public function setImagenUrl(string $imagenUrl): self
    {
        $this->imagenUrl = $imagenUrl;
        return $this;
    }
}
