<%@ import namespace="system.IO" %>
<%

Try

dim fields
if Request.QueryString("ulap_url") Is Nothing then
  fields = Request.Form
else
  fields = Request.QueryString
end if
dim url = fields("ulap_url")

if instr(url, "http://www.planyo.com") <= 0 then
  Response.Write("Error: Call to " & url & " not allowed")
  Response.End
end if 

dim urlencoded = ""
dim key
for each key in fields
  if key IsNot Nothing then
    urlencoded = urlencoded & key & "=" & Server.UrlEncode(fields(key)) & "&"
  end if 
next
urlencoded = urlencoded & "modver=1.3";

Dim xml as System.Net.HttpWebRequest
Dim uri as new Uri(url)
xml = DirectCast(System.Net.HttpWebRequest.Create(uri), System.Net.HttpWebRequest)
xml.Method = "POST"
xml.ContentType = "application/x-www-form-urlencoded"
xml.ContentLength = urlencoded.Length

Dim writer As New StreamWriter(xml.GetRequestStream)
writer.Write(urlencoded)
writer.Close()
Dim oResponse As System.Net.HttpWebResponse = xml.GetResponse()
Dim reader As New StreamReader(oResponse.GetResponseStream())
Dim tmp As String = reader.ReadToEnd()
oResponse.Close()
Response.Write(tmp)

Catch ex As Exception
Response.Write("<pre>"+ex.ToString+"</pre>")
End Try
%>