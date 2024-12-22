import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AddOnServices() {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center text-white mb-8">Add-On Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Additional Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-2">$10/month</p>
            <p className="text-sm text-muted-foreground">For every extra 100 GB</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Custom Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-2">$500 one-time fee</p>
            <p className="text-sm text-muted-foreground">Per tool (e.g., proprietary CRMs, custom APIs)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-2">Starting at 10% off</p>
            <p className="text-sm text-muted-foreground">For teams of 10+ users</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

