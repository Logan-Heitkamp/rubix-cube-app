import { useState, useEffect, useCallback } from 'react';
import { useCubeStore } from '../../store/useCubeStore';
import { parseNotation, isValidMove } from '../../shared/utils/notation';
import { COLORS } from '../../config/cube';

export function useCube() {
  const { state, dispatch, resetCube, rotateFace, startAlgorithm, stopAlgorithm } = useCubeStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(500);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const applyMove = useCallback(
    (move: string) => {
      if (!isValidMove(move)) return;

      dispatch({
        type: 'MOVE_FACE',
        payload: state.faces,
        move,
      });
    },
    [dispatch, state.faces]
  );

  const applySequence = useCallback(
    (notation: string) => {
      const moves = parseNotation(notation);
      if (moves.length === 0) return;

      let currentIndex = 0;

      const playSequence = async () => {
        if (currentIndex >= moves.length) {
          setIsPlaying(false);
          return;
        }

        const move = moves[currentIndex];
        applyMove(move);
        setCurrentMoveIndex(currentIndex);

        currentIndex++;
        setTimeout(playSequence, playbackSpeed);
      };

      setIsPlaying(true);
      playSequence();
    },
    [applyMove, playbackSpeed]
  );

  const playAlgorithm = useCallback(
    (id: string, name: string, notation: string) => {
      const moves = parseNotation(notation);
      startAlgorithm(id, name, moves);
    },
    [startAlgorithm]
  );

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    stopAlgorithm();
    setCurrentMoveIndex(0);
  }, [stopAlgorithm]);

  const handleReset = useCallback(() => {
    stopPlayback();
    resetCube();
  }, [stopPlayback, resetCube]);

  const handleRotate = useCallback(
    (x: number, y: number) => {
      rotateFace(x, y);
    },
    [rotateFace]
  );

  return {
    state,
    isPlaying,
    currentMoveIndex,
    playbackSpeed,
    applyMove,
    applySequence,
    playAlgorithm,
    stopPlayback,
    handleReset,
    handleRotate,
    setPlaybackSpeed,
  };
}
