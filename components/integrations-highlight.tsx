import Image from 'next/image'
import { VideoPlayer } from './video-player'

const integrations = [
  { name: "Google Calendar", logo: "/GoogleCalendarLogo.png" },
  { name: "Google Meet", logo: "/GoogleMeetLogo.png" },
  { name: "Zoom", logo: "/ZoomLogo.png" },
  { name: "Microsoft Teams", logo: "/MicrosoftTeamsLogo.png" },
  { name: "Slack", logo: "/SlackLogo.png" },
  { name: "Asana", logo: "/TrelloLogo.png" },
]

export function IntegrationsHighlight() {
  return (
    <section className="section-padding py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-12">Seamless Integrations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {integrations.map((integration) => (
            <div key={integration.name} className="text-center">
              <div className='w-20 h-20 rounded-full bg-white p-2 flex items-center justify-center'>
              <VideoPlayer
              src='https://www.youtube.com/watch?v=cbj_bmFflrE'
              ></VideoPlayer>
              </div>
              <p className="text-sm text-muted-foreground">{integration.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

