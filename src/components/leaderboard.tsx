'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Clock, AlertCircle } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Leaderboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchRanks() {
      const { data, error: fetchError } = await supabase
        .from('RANKS')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (fetchError) {
        setError(fetchError);
      } else {
        setScores(data || []);
      }
      setIsLoading(false);
    }
    fetchRanks();
  }, []);

  if (isLoading) return (
    <div className="space-y-4 p-4">
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  );

  if (error) return (
    <div className="space-y-4 p-4">
      <Alert variant="destructive" className="border-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error de Base de Datos</AlertTitle>
        <AlertDescription>
          {error.message}. Revisa la consola o las políticas en Supabase.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <Card className="bg-surface-container border-0 shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-2xl font-headline font-black">
          <Trophy className="text-yellow-500" />
          Ranking Global
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        {!scores || scores.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="bg-surface-container-high w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="text-muted-foreground/30" size={32} />
            </div>
            <div className="space-y-1">
                <p className="text-on-surface font-black text-xl">¡El podio está vacío!</p>
                <p className="text-sm text-on-surface-variant max-w-[250px] mx-auto italic">
                    Sé el primero en registrar un récord.
                </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Guerrero</TableHead>
                <TableHead className="text-right">Puntos</TableHead>
                <TableHead className="text-right hidden sm:table-cell">Tiempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scores.map((entry, index) => (
                <TableRow key={entry.id} className={index < 3 ? "bg-primary/5 hover:bg-primary/10 border-primary/10" : "border-border/30"}>
                  <TableCell className="text-center font-black">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                    {index > 2 && index + 1}
                  </TableCell>
                  <TableCell className="font-bold text-lg capitalize">{entry.name}</TableCell>
                  <TableCell className="text-right font-black text-primary text-xl">
                    {entry.score.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1 text-xs font-mono text-muted-foreground">
                      <Clock size={12} /> {entry.timeSeconds}s
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
