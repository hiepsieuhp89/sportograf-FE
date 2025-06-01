"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "@/hooks/use-translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Check, 
  X, 
  MessageSquare, 
  Eye, 
  Trash2,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"
import { 
  getFAQs, 
  updateFAQStatus, 
  updateFAQAnswer, 
  deleteFAQ,
  getPendingFAQs 
} from "@/lib/faq-service"
import { getTranslatedContent } from "@/lib/translation-utils"
import type { FAQ } from "@/lib/types"
import { format } from "date-fns"

export function FAQManagement() {
  const { t, language } = useTranslations()
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null)
  const [showAnswerDialog, setShowAnswerDialog] = useState(false)
  const [answer, setAnswer] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  useEffect(() => {
    loadFAQs()
  }, [filter])

  const loadFAQs = async () => {
    try {
      setLoading(true)
      let faqData: FAQ[]
      
      if (filter === "all") {
        faqData = await getFAQs()
      } else {
        faqData = await getFAQs(filter)
      }
      
      setFAQs(faqData)
    } catch (error) {
      console.error("Error loading FAQs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (faqId: string) => {
    try {
      await updateFAQStatus(faqId, "approved", "admin")
      await loadFAQs()
    } catch (error) {
      console.error("Error approving FAQ:", error)
    }
  }

  const handleReject = async (faqId: string) => {
    try {
      await updateFAQStatus(faqId, "rejected", "admin")
      await loadFAQs()
    } catch (error) {
      console.error("Error rejecting FAQ:", error)
    }
  }

  const handleAnswerSubmit = async () => {
    if (!selectedFAQ || !answer.trim()) return

    try {
      setSubmitting(true)
      await updateFAQAnswer(selectedFAQ.id, answer, "admin")
      
      // Also approve the FAQ if it's pending
      if (selectedFAQ.status === "pending") {
        await updateFAQStatus(selectedFAQ.id, "approved", "admin")
      }
      
      setShowAnswerDialog(false)
      setAnswer("")
      setSelectedFAQ(null)
      await loadFAQs()
    } catch (error) {
      console.error("Error updating FAQ answer:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (faqId: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return

    try {
      await deleteFAQ(faqId)
      await loadFAQs()
    } catch (error) {
      console.error("Error deleting FAQ:", error)
    }
  }

  const openAnswerDialog = (faq: FAQ) => {
    setSelectedFAQ(faq)
    setAnswer(faq.answer || "")
    setShowAnswerDialog(true)
  }

  const getStatusIcon = (status: FAQ['status']) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: FAQ['status']) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    }

    const statusLabels = {
      pending: t("pendingApproval"),
      approved: t("approved"),
      rejected: t("rejected")
    }

    return (
      <Badge className={variants[status]}>
        {statusLabels[status]}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("manageFAQs")}</h1>
          <p className="text-gray-600 mt-1">
            Manage FAQ submissions and provide answers
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: t("pendingApproval") },
          { key: "approved", label: t("approved") },
          { key: "rejected", label: t("rejected") }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">{t("noFAQsFound")}</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("title")}</TableHead>
                  <TableHead>{t("faqCategory")}</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqs.map((faq) => {
                  const translatedContent = getTranslatedContent(faq.translations, language)
                  const title = translatedContent?.title || faq.title
                  
                  return (
                    <TableRow key={faq.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(faq.status)}
                          {getStatusBadge(faq.status)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium text-gray-900 truncate">
                            {title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {translatedContent?.question || faq.question}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline">{faq.category}</Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div>{faq.submitterName || "Anonymous"}</div>
                          {faq.submitterEmail && (
                            <div className="text-gray-500">{faq.submitterEmail}</div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {format(new Date(faq.createdAt), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="font-medium">Question:</Label>
                                  <p className="text-gray-700 mt-1">
                                    {translatedContent?.question || faq.question}
                                  </p>
                                </div>
                                {faq.answer && (
                                  <div>
                                    <Label className="font-medium">Answer:</Label>
                                    <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                                      {translatedContent?.answer || faq.answer}
                                    </p>
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label className="font-medium">Category:</Label>
                                    <p>{faq.category}</p>
                                  </div>
                                  <div>
                                    <Label className="font-medium">Status:</Label>
                                    <p>{getStatusBadge(faq.status)}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAnswerDialog(faq)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>

                          {faq.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(faq.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(faq.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(faq.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Answer Dialog */}
      <Dialog open={showAnswerDialog} onOpenChange={setShowAnswerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFAQ?.answer ? t("answer") : t("provideAnswer")}
            </DialogTitle>
          </DialogHeader>
          
          {selectedFAQ && (
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Question:</Label>
                <p className="text-gray-700 mt-1">
                  {getTranslatedContent(selectedFAQ.translations, language)?.question || selectedFAQ.question}
                </p>
              </div>
              
              <div>
                <Label htmlFor="answer">{t("answer")}:</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={t("provideAnswer")}
                  rows={6}
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAnswerDialog(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={submitting || !answer.trim()}
                >
                  {submitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      {t("save")}...
                    </div>
                  ) : (
                    t("saveAnswer")
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 