<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Grado;

/**
 * @extends ServiceEntityRepository<Grado>
 */
class GradoRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Grado::class);
    }

    public function add(Grado $grado): void
    {
        $this->getEntityManager()->persist($grado);

        $this->getEntityManager()->flush();
    }

    public function update(Grado $grado): void
    {
        $this->getEntityManager()->persist($grado);

        $this->getEntityManager()->flush();
    }


    public function remove(Grado $grado): void
    {
        $this->getEntityManager()->remove($grado);

        $this->getEntityManager()->flush();
    }


}
