<?php

declare(strict_types=1);

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Zairigimad\UxHaptics\Twig\HapticsExtension;

return static function (ContainerConfigurator $container): void {
    $services = $container->services();

    $services
        ->set('zairigimad.ux_haptics.twig.haptics_extension', HapticsExtension::class)
        ->tag('twig.extension')
        ->autowire()
        ->autoconfigure();
};
