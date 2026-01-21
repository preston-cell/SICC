"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PageProps {
  params: Promise<{ estatePlanId: string }>;
}

type ContactRole =
  | "executor"
  | "trustee"
  | "healthcare_proxy"
  | "financial_poa"
  | "guardian"
  | "beneficiary"
  | "advisor"
  | "attorney"
  | "other";

const ROLE_DISPLAY_NAMES: Record<ContactRole, string> = {
  executor: "Executor",
  trustee: "Trustee",
  healthcare_proxy: "Healthcare Proxy",
  financial_poa: "Financial Power of Attorney",
  guardian: "Guardian",
  beneficiary: "Beneficiary",
  advisor: "Financial Advisor",
  attorney: "Attorney",
  other: "Other",
};

const ROLE_DESCRIPTIONS: Record<ContactRole, string> = {
  executor: "Person who will manage your estate after death",
  trustee: "Person who will manage your trust",
  healthcare_proxy: "Person who makes medical decisions if you can't",
  financial_poa: "Person who handles your finances if incapacitated",
  guardian: "Person who will care for your minor children",
  beneficiary: "Person who will inherit from your estate",
  advisor: "Your financial advisor or accountant",
  attorney: "Your estate planning attorney",
  other: "Other important contact",
};

export default function ContactsPage({ params }: PageProps) {
  const { estatePlanId } = use(params);
  const estatePlanIdTyped = estatePlanId as Id<"estatePlans">;
  const searchParams = useSearchParams();
  const runId = searchParams.get("runId");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Id<"familyContacts"> | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    role: "executor" as ContactRole,
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const contacts = useQuery(api.familyContacts.getContacts, {
    estatePlanId: estatePlanIdTyped,
  });

  const createContact = useMutation(api.familyContacts.createContact);
  const updateContact = useMutation(api.familyContacts.updateContact);
  const deleteContact = useMutation(api.familyContacts.deleteContact);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    if (editingContact) {
      await updateContact({
        contactId: editingContact,
        ...formData,
      });
      setEditingContact(null);
    } else {
      await createContact({
        estatePlanId: estatePlanIdTyped,
        ...formData,
      });
    }

    setFormData({
      name: "",
      relationship: "",
      role: "executor",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
    setShowAddForm(false);
  };

  const handleEdit = (contact: NonNullable<typeof contacts>[number]) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      role: contact.role as ContactRole,
      phone: contact.phone || "",
      email: contact.email || "",
      address: contact.address || "",
      notes: contact.notes || "",
    });
    setEditingContact(contact._id);
    setShowAddForm(true);
  };

  const handleDelete = async (contactId: Id<"familyContacts">) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      await deleteContact({ contactId });
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingContact(null);
    setFormData({
      name: "",
      relationship: "",
      role: "executor",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
  };

  if (!contacts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-purple)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href={`/analysis/${estatePlanId}/prepare${runId ? `?runId=${runId}` : ""}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-body)] mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-heading)]">
                Family & Advisor Contacts
              </h1>
              <p className="text-[var(--text-muted)] mt-1">
                Add contact information for key people in your estate plan
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Contact
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Suggested roles */}
        {contacts.length < 4 && !showAddForm && (
          <div className="mb-8 p-6 bg-[var(--accent-muted)] rounded-xl">
            <h3 className="font-semibold text-[var(--text-heading)] mb-3">Suggested Contacts</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(["executor", "healthcare_proxy", "financial_poa", "guardian", "attorney", "advisor"] as ContactRole[])
                .filter((role) => !contacts.some((c) => c.role === role))
                .slice(0, 6)
                .map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, role }));
                      setShowAddForm(true);
                    }}
                    className="flex items-center gap-2 p-3 bg-white rounded-lg border border-[var(--border)] hover:border-[var(--accent-purple)] hover:shadow-sm transition-all text-left"
                  >
                    <svg className="w-5 h-5 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--text-heading)]">
                      {ROLE_DISPLAY_NAMES[role]}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Add/Edit form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-xl border border-[var(--border)] p-6">
            <h3 className="font-semibold text-[var(--text-heading)] mb-4">
              {editingContact ? "Edit Contact" : "Add New Contact"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={formData.relationship}
                    onChange={(e) => setFormData((prev) => ({ ...prev, relationship: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent"
                    placeholder="Brother, Attorney, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as ContactRole }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent"
                >
                  {(Object.keys(ROLE_DISPLAY_NAMES) as ContactRole[]).map((role) => (
                    <option key={role} value={role}>
                      {ROLE_DISPLAY_NAMES[role]}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {ROLE_DESCRIPTIONS[formData.role]}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent"
                  placeholder="123 Main St, City, State 12345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--accent-purple)] focus:border-transparent resize-none"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                  {editingContact ? "Save Changes" : "Add Contact"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-100 text-[var(--text-body)] font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contacts list */}
        {contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white rounded-xl border border-[var(--border)] p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent-purple)] font-semibold text-lg">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-heading)]">{contact.name}</h3>
                      <p className="text-sm text-[var(--accent-purple)]">
                        {ROLE_DISPLAY_NAMES[contact.role as ContactRole]}
                      </p>
                      {contact.relationship && (
                        <p className="text-sm text-[var(--text-muted)]">{contact.relationship}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-purple)] hover:bg-[var(--accent-muted)] rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                {(contact.phone || contact.email || contact.address) && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    {contact.phone && (
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {contact.phone}
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {contact.email}
                      </div>
                    )}
                    {contact.address && (
                      <div className="flex items-center gap-2 text-[var(--text-muted)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {contact.address}
                      </div>
                    )}
                  </div>
                )}
                {contact.notes && (
                  <p className="mt-3 text-sm text-[var(--text-muted)] italic">{contact.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          !showAddForm && (
            <div className="text-center py-12 bg-white rounded-xl border border-[var(--border)]">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--accent-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[var(--text-heading)] mb-2">
                No Contacts Added Yet
              </h3>
              <p className="text-[var(--text-muted)] max-w-md mx-auto mb-6">
                Add contact information for the people who will be involved in your estate plan.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
              >
                Add Your First Contact
              </button>
            </div>
          )
        )}
      </main>
    </div>
  );
}
