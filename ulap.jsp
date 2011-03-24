<%@ page import="java.util.*,java.net.*,java.io.*" %>
<%
String ulap_url = request.getParameter("ulap_url");
if (ulap_url != null && (ulap_url.indexOf ("http://www.planyo.com") == 0 || ulap_url.indexOf ("https://www.planyo.com") == 0)) {
  String urlencoded = "";
  Enumeration paramNames = request.getParameterNames();
  while(paramNames.hasMoreElements()) {
    String paramName = (String)paramNames.nextElement();
    String paramValue = request.getParameter(paramName);
    if (paramValue != null)
      urlencoded = urlencoded.concat (paramName + "=" + URLEncoder.encode(paramValue, "UTF-8") + "&");
  }
  urlencoded = urlencoded.concat ("modver=1.6");
  try {
    URL url = new URL(ulap_url);
    URLConnection conn = url.openConnection();
    conn.setDoOutput(true);
    OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
    wr.write(urlencoded);
    wr.flush();
    BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    String line;
    while ((line = rd.readLine()) != null) {
      out.println(line);
    }
    wr.close();
    rd.close();
  } catch (Exception e) {
    out.write(e.toString());
  }
}

%>