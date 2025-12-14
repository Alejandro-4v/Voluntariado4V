<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Voluntario;

/**
 * @extends ServiceEntityRepository<Voluntario>
 */
class VoluntarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Voluntario::class);
    }

public function add(Voluntario $voluntario): void
    {
        $this->getEntityManager()->persist($voluntario);

        $this->getEntityManager()->flush();
    }

    public function update(Voluntario $voluntario): void
    {
        $this->getEntityManager()->persist($voluntario);

        $this->getEntityManager()->flush();
    }

    public function remove(Voluntario $voluntario): void
    {
        $this->getEntityManager()->remove($voluntario);

        $this->getEntityManager()->flush();
    }
}
