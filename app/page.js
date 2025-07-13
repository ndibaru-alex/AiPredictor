import MatchPredictor from '@/components/predict-game'
import Image from 'next/image'

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('./stadium.jpg')" }}
    >
      <MatchPredictor />
    </div>
  )
}
