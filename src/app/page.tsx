import Typography from '@/components/ui/typography'
import Map from '@/components/common/map'

export default function Home() {
  return (
    <div
      className="flex flex-col pt-11 pb-24 px-8 w-full items-center
        text-center gap-12"
    >
      <div className="flex flex-col gap-6 items-center">
        <Typography className="max-w-2xl" variant="h1">
          Mid-West Bouldering Map
        </Typography>
      </div>
      <Map />
    </div>
  )
}
