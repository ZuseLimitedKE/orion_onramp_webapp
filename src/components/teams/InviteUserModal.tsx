import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, UserCog } from 'lucide-react'
import type { InviteUserFormData } from '@/types/businesses'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  USER_ROLES,
  USER_ROLE_DESCRIPTIONS,
  inviteUserSchema,
} from '@/types/businesses'

interface InviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (data: InviteUserFormData) => Promise<void>
  isInviting: boolean
  businessId: string
}

export function InviteUserModal({
  open,
  onOpenChange,
  onInvite,
  isInviting,
}: InviteUserModalProps) {
  const form = useForm<InviteUserFormData>({
    resolver: (
      zodResolver as unknown as (
        schema: unknown,
      ) => Resolver<InviteUserFormData>
    )(inviteUserSchema),
    defaultValues: {
      email: '',
      role: USER_ROLES.DEVELOPER,
    },
  })

  const handleSubmit = async (data: InviteUserFormData) => {
    try {
      await onInvite(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      // Error is already handled by the mutation
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Invite a new team member to collaborate on this business. They'll
            receive an email invitation.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="team.member@example.com"
                        className="pl-10"
                        type="email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Select a role" />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-w-[400px]">
                      {Object.values(USER_ROLES).map((role) => (
                        <SelectItem
                          key={role}
                          value={role}
                          className="cursor-pointer"
                        >
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{role}</span>
                            <span className="text-xs text-muted-foreground max-w-[350px] whitespace-normal leading-relaxed">
                              {USER_ROLE_DESCRIPTIONS[role]}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isInviting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isInviting}>
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
