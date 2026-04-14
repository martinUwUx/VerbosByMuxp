'use client';

import { supabase } from '@/lib/supabase';

export type PlayerData = {
  id: string;
  name: string;
  progress: number;
  score: number;
  finished: boolean;
  timeSeconds: number;
};

export type MatchData = {
  id: string;
  listName: string;
  status: 'waiting' | 'active' | 'finished';
  players: Record<string, PlayerData>;
  createdAt?: any;
};

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export async function createMatch(listName: string, playerName: string, playerId: string): Promise<string> {
  const roomCode = generateRoomCode();
  
  const players = {
    [playerId]: {
      id: playerId,
      name: playerName,
      progress: 0,
      score: 0,
      finished: false,
      timeSeconds: 0
    }
  };

  const { error } = await supabase
    .from('MATCHES')
    .insert([
      { id: roomCode, listName, status: 'waiting', players }
    ]);

  if (error) {
    console.error('Error al crear sala en Supabase:', error);
  }

  return roomCode;
}

export async function joinMatch(roomCode: string, playerName: string, playerId: string): Promise<boolean> {
  const matchId = roomCode.toUpperCase();
  
  // Obtenemos los jugadores actuales
  const { data: matchData, error: fetchError } = await supabase
    .from('MATCHES')
    .select('players')
    .eq('id', matchId)
    .single();

  if (fetchError || !matchData) {
    console.error('No se encontró la sala en Supabase', fetchError);
    return false;
  }

  const newPlayers = {
    ...matchData.players,
    [playerId]: {
      id: playerId,
      name: playerName,
      progress: 0,
      score: 0,
      finished: false,
      timeSeconds: 0
    }
  };

  const { error } = await supabase
    .from('MATCHES')
    .update({ players: newPlayers, status: 'active' })
    .eq('id', matchId);

  if (error) {
    console.error('Error al unirse a la sala:', error);
  }

  return true;
}

export async function updateMatchProgress(
  roomCode: string, 
  playerId: string, 
  progress: number, 
  score: number, 
  finished: boolean = false,
  timeSeconds: number = 0
) {
  const matchId = roomCode.toUpperCase();

  const { data: matchData, error: fetchError } = await supabase
    .from('MATCHES')
    .select('players')
    .eq('id', matchId)
    .single();

  if (fetchError || !matchData) return;

  const newPlayers = {
    ...matchData.players,
    [playerId]: {
      ...matchData.players[playerId],
      progress,
      score,
      finished,
      timeSeconds
    }
  };

  const { error } = await supabase
    .from('MATCHES')
    .update({ players: newPlayers })
    .eq('id', matchId);

  if (error) {
    console.error('Error actualizando progreso en Supabase:', error);
  }
}