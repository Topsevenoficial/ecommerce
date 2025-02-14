"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check } from "lucide-react";

export type Agency = {
  id: string;
  name: string;
  ubicacion: string;
  direction: string;
};

interface AgenciasComboboxProps {
  agencies: Agency[];
  selectedAgency: Agency | null;
  onSelect: (agency: Agency) => void;
}

// Hook de debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function AgenciasCombobox({
  agencies,
  selectedAgency,
  onSelect,
}: AgenciasComboboxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  const normalizedQuery = normalizeText(debouncedQuery);
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  // Manejo de scroll infinito
  const [visibleCount, setVisibleCount] = useState(20);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(20);
  }, [normalizedQuery]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [normalizedQuery]);

  const normalizeUbicacion = (ubicacion: string) =>
    normalizeText(ubicacion.replace(/\//g, " "));

  // Filtramos y ordenamos las agencias según la consulta
  const sortedAgencies = useMemo(() => {
    if (queryWords.length === 0) return [];
    const filtered = agencies.filter((agency) => {
      const normalizedUbic = normalizeUbicacion(agency.ubicacion);
      return queryWords.every((word) => normalizedUbic.includes(word));
    });
    return filtered.sort((a, b) => {
      const aValue = normalizeUbicacion(a.ubicacion);
      const bValue = normalizeUbicacion(b.ubicacion);
      const scoreA = queryWords.reduce(
        (acc, word) =>
          acc + (aValue.indexOf(word) === -1 ? 1000 : aValue.indexOf(word)),
        0
      );
      const scoreB = queryWords.reduce(
        (acc, word) =>
          acc + (bValue.indexOf(word) === -1 ? 1000 : bValue.indexOf(word)),
        0
      );
      return scoreA - scoreB;
    });
  }, [agencies, queryWords]);

  const visibleAgencies = sortedAgencies.slice(0, visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
      setVisibleCount((prev) => Math.min(prev + 6, sortedAgencies.length));
    }
  };

  // Auto-expand si la lista es más pequeña que el alto del contenedor
  useEffect(() => {
    if (scrollRef.current) {
      const { clientHeight, scrollHeight } = scrollRef.current;
      const MAX_AUTO_LOAD = 50;
      if (
        scrollHeight <= clientHeight &&
        visibleCount < sortedAgencies.length &&
        visibleCount < MAX_AUTO_LOAD
      ) {
        setVisibleCount((prev) => Math.min(prev + 6, sortedAgencies.length));
      }
    }
  }, [visibleCount, sortedAgencies.length, normalizedQuery]);

  const truncateText = (text: string, maxLength: number) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  const handleSelect = (agency: Agency) => {
    onSelect(agency);
    // Limpia la búsqueda y muestra la tarjeta
    setSearchQuery("");
  };

  return (
    <div className="border border-input rounded-md px-2 py-2">
      {/* Componente <Command> para la entrada + lista */}
      <Command>
        <CommandInput
          placeholder="Buscar agencia..."
          className="h-9"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />

        <CommandList
          onScroll={handleScroll}
          ref={scrollRef}
          className="max-h-60 overflow-auto"
        >
          {/* Lógica para ver qué mostrar según searchQuery y selectedAgency */}
          {searchQuery.trim() === "" ? (
            selectedAgency ? (
              // Si NO hay búsqueda, pero SÍ hay agencia => tarjeta
              <div className="p-2 space-y-1">
                <p className="font-semibold">{selectedAgency.name}</p>
                <p className="text-sm">{selectedAgency.direction}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedAgency.ubicacion}
                </p>
              </div>
            ) : (
              // Si NO hay búsqueda y NO hay agencia => mensaje "Ingresa..."
              <CommandEmpty>
                Ingresa el nombre o ubicación para buscar.
              </CommandEmpty>
            )
          ) : visibleAgencies.length === 0 ? (
            // Si hay búsqueda, pero no hay resultados => "No se encontraron..."
            <CommandEmpty>No se encontraron agencias.</CommandEmpty>
          ) : (
            // Si hay búsqueda y resultados => lista de agencias
            <CommandGroup>
              {visibleAgencies.map((agency) => (
                <CommandItem
                  key={agency.id}
                  value={normalizeUbicacion(agency.ubicacion)}
                  onSelect={() => handleSelect(agency)}
                >
                  <div>
                    <span className="font-semibold">{agency.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="block text-xs text-muted-foreground">
                            {truncateText(agency.direction, 30)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{agency.direction}</p>
                          <p className="text-xs text-muted-foreground">
                            {agency.ubicacion}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  {selectedAgency?.id === agency.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}

export default AgenciasCombobox;
