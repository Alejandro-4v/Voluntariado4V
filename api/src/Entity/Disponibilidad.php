<?php

namespace App\Entity;

use App\Repository\DisponibilidadRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use DateTimeImmutable;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: DisponibilidadRepository::class)]
#[ORM\Table(name: 'DISPONIBILIDAD')]
class Disponibilidad
{
    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: Voluntario::class, inversedBy: 'disponibilidades')]
    #[ORM\JoinColumn(name: 'nif', referencedColumnName: 'nif', nullable: false)]
    private ?Voluntario $voluntario = null;

    #[ORM\Id]
    #[ORM\ManyToOne(targetEntity: DiaSemana::class, inversedBy: 'disponibilidades')]
    #[ORM\JoinColumn(name: 'id_dia', referencedColumnName: 'id_dia', nullable: false)]
    #[Groups(['disponibilidad:read'])]
    private ?DiaSemana $diaSemana = null;

    #[ORM\Column(name: 'hora_inicio', type: Types::TIME_IMMUTABLE)]
    #[Groups(['disponibilidad:read'])]
    private DateTimeImmutable $horaInicio;

    #[ORM\Column(name: 'hora_fin', type: Types::TIME_IMMUTABLE)]
    #[Groups(['disponibilidad:read'])]
    private DateTimeImmutable $horaFin;

    public function getVoluntario(): ?Voluntario
    {
        return $this->voluntario;
    }

    public function setVoluntario(?Voluntario $voluntario): self
    {
        $this->voluntario = $voluntario;
        return $this;
    }

    public function getDiaSemana(): ?DiaSemana
    {
        return $this->diaSemana;
    }

    public function setDiaSemana(?DiaSemana $diaSemana): self
    {
        $this->diaSemana = $diaSemana;
        return $this;
    }

    public function getHoraInicio(): DateTimeImmutable
    {
        return $this->horaInicio;
    }

    public function setHoraInicio(DateTimeImmutable $horaInicio): self
    {
        $this->horaInicio = $horaInicio;
        return $this;
    }

    public function getHoraFin(): DateTimeImmutable
    {
        return $this->horaFin;
    }

    public function setHoraFin(DateTimeImmutable $horaFin): self
    {
        $this->horaFin = $horaFin;
        return $this;
    }
}
