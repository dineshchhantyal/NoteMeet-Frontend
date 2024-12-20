import Image from 'next/image'

const integrations = [
  { name: "Google Calendar", logo: "/google-calendar-logo.svg" },
  { name: "Zoom", logo: "/zoom-logo.svg" },
  { name: "Slack", logo: "/slack-logo.svg" },
  { name: "Microsoft Teams", logo: "/ms-teams-logo.svg" },
  { name: "Trello", logo: "/trello-logo.svg" },
  { name: "Asana", logo: "/asana-logo.svg" },
]

export function IntegrationsHighlight() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-12">Seamless Integrations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {integrations.map((integration) => (
            <div key={integration.name} className="text-center">
              <Image
                src={integration.logo}
                alt={`${integration.name} logo`}
                width={80}
                height={80}
                className="mx-auto mb-2"
              />
              <p className="text-sm text-muted-foreground">{integration.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

